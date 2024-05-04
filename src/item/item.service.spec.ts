import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemType } from '../common/types';
import { CreateItemDto } from './dto/request/create-item.dto';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';
import {
  createBeerDtoFactory,
  createBreadDtoFactory,
  createItemFactory,
  createItemWithBeerDto,
  createItemWithBreadDto,
  createItemWithVegetableDto,
  createVegetableDtoFactory,
} from './testUtils';

describe('ItemService', () => {
  let service: ItemService;
  let itemRepository: Repository<Item>;

  const mockItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: getRepositoryToken(Item), useValue: mockItemRepository },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    itemRepository = module.get(getRepositoryToken(Item));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* CREATE */
  describe('create', () => {
    it('should throw an error if an invalid item type is provided', async () => {
      const createItemDto = {
        type: 'INVALID_TYPE',
      } as unknown as CreateItemDto;
      await expect(service.create(createItemDto)).rejects.toThrow(
        'Error creating a new item',
      );
    });

    it('should handle errors when creating a new item', async () => {
      const itemDto = createItemWithVegetableDto();
      mockItemRepository.save.mockRejectedValue(
        new Error('Error creating a new item'),
      );

      await expect(service.create(itemDto)).rejects.toThrow(
        'Error creating a new item',
      );
    });

    it('should create a new item of type BREAD', async () => {
      const breadDto = createBreadDtoFactory({});
      const itemDto = createItemWithBreadDto();
      const newItem: Item = createItemFactory(breadDto, ItemType.BREAD);

      mockItemRepository.create.mockReturnValue(newItem);
      mockItemRepository.save.mockResolvedValue(newItem);

      const result = await service.create(itemDto);
      expect(result).toEqual(newItem);
      expect(mockItemRepository.create).toHaveBeenCalledWith({
        type: ItemType.BREAD,
        ...breadDto,
      });
      expect(mockItemRepository.save).toHaveBeenCalledWith(newItem);
    });

    it('should create a new item of type VEGETABLE', async () => {
      const vegetableDto = createVegetableDtoFactory({});
      const itemDto = createItemWithVegetableDto();
      const newItem: Item = createItemFactory(vegetableDto, ItemType.VEGETABLE);

      mockItemRepository.create.mockReturnValue(newItem);
      mockItemRepository.save.mockResolvedValue(newItem);

      const result = await service.create(itemDto);
      expect(result).toEqual(newItem);
      expect(mockItemRepository.create).toHaveBeenCalledWith({
        type: ItemType.VEGETABLE,
        ...vegetableDto,
      });
      expect(mockItemRepository.save).toHaveBeenCalledWith(newItem);
    });

    it('should create a new item of type BEER', async () => {
      const beerDto = createBeerDtoFactory({});
      const itemDto = createItemWithBeerDto();
      const newItem: Item = createItemFactory(beerDto, ItemType.BEER);

      mockItemRepository.create.mockReturnValue(newItem);
      mockItemRepository.save.mockResolvedValue(newItem);

      const result = await service.create(itemDto);
      expect(result).toEqual(newItem);
      expect(mockItemRepository.create).toHaveBeenCalledWith({
        type: ItemType.BEER,
        ...beerDto,
      });
      expect(mockItemRepository.save).toHaveBeenCalledWith(newItem);
    });
  });

  /* FIND ALL */
  describe('findAll', () => {
    it('should return an array of items', async () => {
      const items = [{ id: 1 }, { id: 2 }];
      mockItemRepository.find.mockResolvedValue(items);

      const result = await service.findAll();
      expect(result).toEqual(items);
      expect(mockItemRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if no items found', async () => {
      mockItemRepository.find.mockResolvedValue(null);

      await expect(service.findAll()).rejects.toThrow(
        new NotFoundException('Error getting all items'),
      );
    });
  });

  /* FIND ONE */
  describe('findOne', () => {
    it('should return a single item', async () => {
      const item = { id: 1 };
      mockItemRepository.findOne.mockResolvedValue(item);

      const result = await service.findOne(1);
      expect(result).toEqual(item);
      expect(mockItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw an error if no item found', async () => {
      mockItemRepository.findOne.mockRejectedValueOnce(
        new NotFoundException('Could not find an item'),
      );

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Could not find an item'),
      );
      expect(mockItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  /* UPDATE */
  describe('update', () => {
    it('should throw an error if no item found', async () => {
      mockItemRepository.findOne.mockRejectedValueOnce(
        new NotFoundException('Could not find an item'),
      );

      await expect(service.update(999, {})).rejects.toThrow(
        new NotFoundException('Could not find an item'),
      );
      expect(mockItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should update an item', async () => {
      const beerItem = {
        id: 1,
        price: 200,
      } as Item;
      jest.spyOn(itemRepository, 'findOne').mockResolvedValue(beerItem);

      const updateItemDto = { price: 89 };
      const result = await service.update(1, updateItemDto);
      expect(result).toEqual({ ...beerItem, price: 89 });
      expect(mockItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  /* REMOVE */
  describe('remove', () => {
    it('should remove an item', async () => {
      const item = { id: 1 };
      mockItemRepository.findOne.mockResolvedValue(item);

      await service.remove(1);
      expect(mockItemRepository.remove).toHaveBeenCalledWith(item);
    });

    it('should throw an error if no item found', async () => {
      mockItemRepository.findOne.mockRejectedValueOnce(
        new NotFoundException('Could not find an item'),
      );

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Could not find an item'),
      );
      expect(mockItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
});
