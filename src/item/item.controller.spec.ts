import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/request/create-item.dto';
import { UpdateItemDto } from './dto/request/update-item.dto';
import { Item } from './entities/item.entity';
import { ItemType } from '../common/types';

describe('ItemController', () => {
  let controller: ItemController;
  let mockItemService: Partial<ItemService>;

  beforeEach(async () => {
    mockItemService = {
      create: (createItemDto: CreateItemDto) => {
        return Promise.resolve({ ...createItemDto, id: 1 } as Item);
      },
      findAll: () => {
        return Promise.resolve([
          { id: 1, name: 'Carrot', type: 'Vegetable', price: 10.0, weight: 30 },
        ] as Item[]);
      },
      findOne: (_id: number) => {
        return Promise.resolve({
          id: 1,
          name: 'Carrot',
          type: ItemType.VEGETABLE,
          price: 10.0,
          weight: 30,
        } as Item);
      },
      update: (id: number, updateItemDto: UpdateItemDto) => {
        return Promise.resolve({ id, ...updateItemDto } as Item);
      },
      remove: (id: number) => {
        return Promise.resolve({ id } as Item);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: mockItemService,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('(findAll) should return a list of items', async () => {
    const items = await controller.findAll();
    expect(items.length).toEqual(1);
    expect(items[0].name).toEqual('Carrot');
  });

  it('(findOne) should return an item with the given id', async () => {
    const item = await controller.findOne(1);
    expect(item).toBeDefined();
    expect(item.id).toEqual(1);
  });

  it('(findOne) should throw an error if item with given id is not found', async () => {
    mockItemService.findOne = () => null;
    try {
      await controller.findOne(1);
    } catch (error) {
      expect(error).toEqual(new NotFoundException('Item not found'));
    }
  });

  it('(create) should return the created item', async () => {
    const newItemDto: CreateItemDto = {
      name: 'Whole Wheat Bread',
      type: ItemType.BREAD,
      price: 2.99,
      ageInDays: 2,
      quantity: 6,
    };
    const createdItem = await controller.create(newItemDto);
    expect(createdItem).toBeDefined();
    expect(createdItem.id).toEqual(1);
    expect(createdItem.name).toEqual(newItemDto.name);
  });

  it('(update) should return the updated item', async () => {
    const updatedItemDto: UpdateItemDto = {
      name: 'Whole Wheat Bread',
      type: ItemType.BREAD,
      price: 2.99,
      ageInDays: 2,
      quantity: 6,
    };
    const updatedItem = await controller.update(1, updatedItemDto);
    expect(updatedItem).toBeDefined();
    expect(updatedItem.id).toEqual(1);
    expect(updatedItem.name).toEqual(updatedItemDto.name);
  });

  it('(remove) should return the removed item', async () => {
    const removedItem = await controller.remove(1);
    expect(removedItem).toBeDefined();
    expect(removedItem.id).toEqual(1);
  });
});
