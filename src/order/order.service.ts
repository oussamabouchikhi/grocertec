import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from '../item/dto/request/create-item.dto';
import { Repository } from 'typeorm';
import { Item } from '../item/entities/item.entity';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  private logger = new Logger('OrderService');
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(): Promise<Order> {
    try {
      const createdOrder = this.orderRepository.create();
      createdOrder.items = [];

      const savedOrder = await this.orderRepository.save(createdOrder);
      return savedOrder;
    } catch (error) {
      this.logger.error('Error creating a new order', error);
      throw new Error('Error creating a new order');
    }
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find({ relations: ['items'] });
    if (!orders) {
      this.logger.error('Error getting all orders');
      throw new NotFoundException('Error getting all orders');
    }

    return orders;
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) {
      this.logger.error(`Could not find an order with id ${id}`);
      throw new NotFoundException('Could not find order');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const foundOrder = await this.findOne(id);

    if (!foundOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    const { items: itemDtos } = updateOrderDto;

    if (itemDtos && itemDtos.length > 0) {
      for (const itemDto of itemDtos) {
        const newItem = this.itemRepository.create(itemDto as CreateItemDto);
        await this.itemRepository.save(newItem);

        foundOrder.items.push(newItem);
        await this.orderRepository.save(foundOrder);
      }
    }

    await this.orderRepository.save(foundOrder);

    return foundOrder;
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      this.logger.error(`Could not find an order with id ${id}`);
      throw new NotFoundException('Could not find order');
    }

    if (order.items && order.items.length > 0) {
      await this.itemRepository.remove(order.items);
    }

    await this.orderRepository.remove(order);
  }
}
