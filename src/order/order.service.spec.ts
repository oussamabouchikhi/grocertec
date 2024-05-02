import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemType } from '../common/types';
import { Item } from '../item/entities/item.entity';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { CreateItemDto } from '../item/dto/request/create-item.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let itemRepository: Repository<Item>;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockItemRepository = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation(() => ({
      ageInDays: 2,
      name: 'Bread',
      price: 10,
      quantity: 1,
      type: 'Bread',
    })),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(Order));
    itemRepository = module.get(getRepositoryToken(Item));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* CREATE */
  describe('create', () => {
    it('should successfully create an order', async () => {
      const createdOrder = {
        items: [],
      };

      mockOrderRepository.create.mockReturnValue(createdOrder);
      mockOrderRepository.save.mockImplementation(async (order) => order);

      const result = await service.create();
      expect(result).toEqual(createdOrder);
      expect(mockOrderRepository.create).toHaveBeenCalled();
      expect(mockOrderRepository.save).toHaveBeenCalled();
    });

    it('should handle errors when creating an order', async () => {
      mockOrderRepository.save.mockRejectedValue(
        new Error('Error creating a new order'),
      );

      await expect(service.create()).rejects.toThrow(
        new Error('Error creating a new order'),
      );
    });
  });

  /* UPDATE */
  describe('update', () => {
    it('should successfully update an order', async () => {
      const createItemDto: CreateItemDto = {
        type: ItemType.BREAD,
        quantity: 1,
        name: 'Bread',
        price: 10,
        ageInDays: 2,
      };
      const updateOrderDto: UpdateOrderDto = {
        items: [createItemDto],
      };
      const order = { id: 1, items: [] };

      mockOrderRepository.findOne.mockResolvedValue(order);

      mockOrderRepository.save.mockResolvedValue({
        ...order,
        ...updateOrderDto,
      });

      const result = await service.update(1, updateOrderDto);
      expect(result).toEqual(
        expect.objectContaining({
          id: order.id,
          items: updateOrderDto.items,
        }),
      );
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        relations: ['items'],
        where: { id: 1 },
      });
      expect(mockOrderRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if the order is not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { items: [] })).rejects.toThrow(
        new NotFoundException('Could not find order'),
      );
    });
  });

  /* FIND ALL */
  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const orders = [{ id: 1 }, { id: 2 }];
      mockOrderRepository.find.mockResolvedValue(orders);

      const result = await service.findAll();
      expect(result).toEqual(orders);
      expect(mockOrderRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if no orders found', async () => {
      mockOrderRepository.find.mockResolvedValue(null);

      await expect(service.findAll()).rejects.toThrow(
        new NotFoundException('Error getting all orders'),
      );
    });
  });

  /* FIND ONE */
  describe('findOne', () => {
    it('should return a single order', async () => {
      const order = { id: 1 };
      mockOrderRepository.findOne.mockResolvedValue(order);

      const result = await service.findOne(1);
      expect(result).toEqual(order);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['items'],
      });
    });

    it('should throw an error if the order is not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('Could not find order'),
      );
    });
  });

  /* REMOVE */
  describe('remove', () => {
    it('should successfully remove an order', async () => {
      const order = {
        id: 1,
      };
      mockOrderRepository.findOne.mockResolvedValue(order);

      const result = await service.remove(1);
      expect(result).toEqual(undefined);
      expect(mockOrderRepository.remove).toHaveBeenCalledWith(order);

      expect(mockItemRepository.remove).not.toHaveBeenCalled();
    });

    it('should successfully remove an order along with associated items', async () => {
      const orderId = 1;
      const order = { id: orderId, items: [{ id: 1 }, { id: 2 }] };
      mockOrderRepository.findOne.mockResolvedValue(order);

      const result = await service.remove(orderId);
      expect(result).toEqual(undefined);
      expect(mockOrderRepository.remove).toHaveBeenCalledWith(order);

      expect(mockItemRepository.remove).toHaveBeenCalledWith(order.items);
    });

    it('should throw an error if the order is not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException('Could not find order'),
      );
    });
  });
});
