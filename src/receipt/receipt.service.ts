import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BeerOrigin, ItemType } from '../common/types';
import { DiscountService } from '../discount/discount.service';
import { Item } from '../item/entities/item.entity';
import { CreateReceiptDto } from './dto/request/create-receipt.dto';
import { UpdateReceiptDto } from './dto/request/update-receipt.dto';
import { Receipt } from './entities/receipt.entity';
import { Order } from '../order/entities/order.entity';
import { CreateItemDto } from '../item/dto/request/create-item.dto';

@Injectable()
export class ReceiptService {
  private logger = new Logger('ReceiptService');
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly discountService: DiscountService,
  ) {}
  /**
   * @description Create a receipt for an order
   * Example order w/ prices:
   * Bread €1,00, Veg €1,00 per 100g, Beer €0,50 per bottle
   * 1. 3 x Bread (three days old) €2,00
   * 2. 200g Vegetables €2,00
   * 3. 6 x Dutch Beers €2,00
   * Total: €17,00
   * @param orderId
   * @returns {Promise<Receipt>} The receipt
   */
  async create(createReceiptDto: CreateReceiptDto): Promise<Receipt> {
    try {
      const receipt = this.receiptRepository.create();

      const order = this.orderRepository.create();
      const items: Item[] = [];

      for (const itemDto of createReceiptDto.order.items) {
        const dto: Partial<CreateItemDto> = {};

        if (itemDto.name) dto.name = itemDto.name;
        if (itemDto.type) dto.type = itemDto.type;
        if (itemDto.price) dto.price = itemDto.price;
        if (itemDto.quantity) dto.quantity = itemDto.quantity;
        if (itemDto.weight) dto.weight = itemDto.weight;
        if (itemDto.ageInDays) dto.ageInDays = itemDto.ageInDays;
        if (itemDto.origin) dto.origin = itemDto.origin;

        const item = this.itemRepository.create(dto);
        await this.itemRepository.save(item);
        items.push(item);
      }
      order.items = items as Item[];
      await this.orderRepository.save(order);

      receipt.order = order;

      const savedReceipt = await this.receiptRepository.save(receipt);
      return savedReceipt;
    } catch (error) {
      this.logger.error('Error creating a new receipt', error);
      throw new Error('Error creating a new receipt');
    }
  }

  async generateFormattedReceipt(): Promise<string> {
    const receipt = await this.receiptRepository.findOne({
      relations: ['order', 'order.items'],
    });
    if (!receipt) {
      throw new NotFoundException('Could not find receipt');
    }

    let formattedReceipt = `Receipt\n`;
    for (const [index, item] of receipt.order.items.entries()) {
      formattedReceipt += `${index + 1}.\t ${this.generateItemName(item)} \t\t €${item.price.toFixed(2)}\n`;
    }

    const total = await this.calculateTotal(receipt.id);
    formattedReceipt += `Total: €${total.toFixed(2)}`;

    this.logger.log(`Receipt created for order ${receipt.order.id}`);
    this.logger.log(formattedReceipt);

    return formattedReceipt;
  }

  generateItemName(item: Item): string {
    switch (item.type) {
      case ItemType.BREAD:
        return this.generateBreadName(item);
      case ItemType.VEGETABLE:
        return this.generateVegetableName(item);
      case ItemType.BEER:
        return this.generateBeerName(item);
      default:
        return `${item.quantity} x ${item.type}`;
    }
  }

  /**
   * Generate a name for a bread item
   * @example 3 x Bread (three days old)
   * @param item The bread item
   * @returns The bread name
   */
  generateBreadName(item: Item): string {
    const age = item.ageInDays > 1 ? `${item.ageInDays} days old` : 'Fresh';
    return `${item.quantity} x ${item.type} (${age})`;
  }

  /**
   * Generate a name for a vegetable item
   * @example 200g Vegetable
   * @param item The vegetable item
   * @returns The vegetable name
   */
  generateVegetableName(item: Item): string {
    return `${item.weight}g ${item.type}`;
  }

  /**
   * Generate a name for a beer item
   * @example 6 x Dutch Beers
   * @param origin The beer origin
   * @returns The beer name
   */
  generateBeerName(item: Item): string {
    const beerOriginName = {
      [BeerOrigin.BELGIUM]: 'Belgian',
      [BeerOrigin.GERMANY]: 'German',
      [BeerOrigin.NETHERLANDS]: 'Dutch',
    };

    if (!beerOriginName[item.origin]) {
      throw new BadRequestException('Invalid beer origin');
    }

    return `${item.quantity} x ${beerOriginName[item.origin]} Beers`;
  }

  async calculateTotal(receiptId: number): Promise<number> {
    const receipt = await this.receiptRepository.findOne({
      where: { id: receiptId },
      relations: ['order', 'order.items'],
    });
    if (!receipt) {
      throw new NotFoundException('Could not find receipt');
    }

    if (!receipt.order || !receipt.order.items.length) {
      throw new BadRequestException('Receipt has no order or no items');
    }

    const total = receipt.order.items.reduce((total, item) => {
      const discount = this.discountService.calculateDiscount(item);
      const quantity = this.calculateQuantity(item);
      let discountedPrice = 0;
      discountedPrice = item.price * quantity - discount;

      const result = total + (discountedPrice > 0 ? discountedPrice : 0);
      return result;
    }, 0);

    return total;
  }

  async findAll(): Promise<Receipt[]> {
    const receipts = await this.receiptRepository.find({
      relations: ['order', 'order.items'],
    });
    if (!receipts) {
      this.logger.error('Error getting all receipts');
      throw new NotFoundException('Error getting all receipts');
    }

    return receipts;
  }

  private calculateQuantity(item: Item): number {
    switch (item.type) {
      case ItemType.VEGETABLE:
        return item.weight / 100;
      case ItemType.BEER:
      case ItemType.BREAD:
        return item.quantity;
      default:
        return item.quantity;
    }
  }

  async findOne(id: number): Promise<Receipt> {
    const receipt = await this.receiptRepository.findOne({
      where: { id },
      relations: ['order', 'order.items'],
    });
    if (!receipt) {
      this.logger.error(`Could not find a receipt with id ${id}`);
      throw new NotFoundException('Could not find a receipt');
    }

    return receipt;
  }

  async update(
    id: number,
    updateReceiptDto: UpdateReceiptDto,
  ): Promise<Receipt> {
    const foundReceipt = await this.findOne(id);

    Object.assign(foundReceipt, updateReceiptDto);
    await this.receiptRepository.save(foundReceipt);

    return foundReceipt;
  }

  async remove(id: number) {
    const foundReceipt = await this.findOne(id);

    await this.receiptRepository.remove(foundReceipt);
  }
}
