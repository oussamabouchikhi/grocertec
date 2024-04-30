import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemType } from '../common/types';
import { CreateBeerDto } from './dto/request/create-beer.dto';
import { CreateBreadDto } from './dto/request/create-bread.dto';
import { CreateItemDto } from './dto/request/create-item.dto';
import { CreateVegetableDto } from './dto/request/create-vegetable.dto';
import { UpdateItemDto } from './dto/request/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  private logger = new Logger('ItemService');
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}
  async create(createItemDto: CreateItemDto): Promise<Item> {
    try {
      switch (createItemDto.type) {
        case ItemType.BREAD:
          return await this.createBread(
            {
              name: createItemDto.name,
              ageInDays: createItemDto.ageInDays,
            },
            createItemDto.price,
          );
        case ItemType.VEGETABLE:
          return await this.createVegetable(
            {
              name: createItemDto.name,
              weight: createItemDto.weight,
            },
            createItemDto.price,
          );
        case ItemType.BEER:
          return await this.createBeer(
            {
              name: createItemDto.name,
              origin: createItemDto.origin,
              quantity: createItemDto.quantity,
            },
            createItemDto.price,
          );
        default:
          throw new Error('Invalid item type');
      }
    } catch (error) {
      this.logger.error('Error creating a new item', error);
      throw new Error('Error creating a new item');
    }
  }

  async createBread(
    createBreadDto: CreateBreadDto,
    price: number,
  ): Promise<Item> {
    const newItem = this.itemRepository.create({
      type: ItemType.BREAD,
      price,
      ...createBreadDto,
    });
    return await this.itemRepository.save(newItem);
  }

  async createVegetable(
    createVegetableDto: CreateVegetableDto,
    price: number,
  ): Promise<Item> {
    const newItem = this.itemRepository.create({
      type: ItemType.VEGETABLE,
      price,
      ...createVegetableDto,
    });
    return await this.itemRepository.save(newItem);
  }

  async createBeer(createBeerDto: CreateBeerDto, price: number): Promise<Item> {
    const newItem = this.itemRepository.create({
      type: ItemType.BEER,
      price,
      ...createBeerDto,
    });
    return await this.itemRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    const items = await this.itemRepository.find();
    if (!items) {
      this.logger.error('Error getting all items');
      throw new NotFoundException('Error getting all items');
    }

    return items;
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      this.logger.error(`Could not find an item with id ${id}`);
      throw new NotFoundException('Could not find an item');
    }

    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const foundItem = await this.findOne(id);

    Object.assign(foundItem, updateItemDto);

    await this.itemRepository.save(foundItem);
    return foundItem;
  }

  async remove(id: number) {
    const foundItem = await this.findOne(id);

    return this.itemRepository.remove(foundItem);
  }
}
