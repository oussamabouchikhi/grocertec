import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BeerOrigin, ItemType } from '../common/types';
import { DiscountService } from '../discount/discount.service';
import { CreateReceiptDto } from './dto/request/create-receipt.dto';
import { Receipt } from './entities/receipt.entity';
import { ReceiptService } from './receipt.service';
import { Order } from '../order/entities/order.entity';
import { Item } from '../item/entities/item.entity';

describe('ReceiptService', () => {
  let receiptService: ReceiptService;
  let discountService: DiscountService;
  let receiptRepository: Repository<Receipt>;
  let orderRepository: Repository<Order>;
  let itemRepository: Repository<Item>;

  const mockReceiptRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDiscountService = {
    calculateDiscount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        DiscountService,
        {
          provide: getRepositoryToken(Receipt),
          useValue: mockReceiptRepository,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository,
        },
        {
          provide: DiscountService,
          useValue: mockDiscountService,
        },
      ],
    }).compile();

    receiptService = module.get<ReceiptService>(ReceiptService);
    discountService = module.get<DiscountService>(DiscountService);
    receiptRepository = module.get(getRepositoryToken(Receipt));
    orderRepository = module.get(getRepositoryToken(Order));
    itemRepository = module.get(getRepositoryToken(Item));
    discountService = module.get(DiscountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* CREATE */
  describe('create', () => {
    it('should create a receipt', async () => {
      // GIVEN
      const breadDto = {
        type: ItemType.BREAD,
        name: 'Bread',
        price: 1.0,
        quantity: 3,
        ageInDays: 3,
      };
      const vegetableDto = {
        type: ItemType.VEGETABLE,
        name: 'Vegetables',
        price: 1.0,
        weight: 200,
      };
      const beerDto = {
        type: ItemType.BEER,
        name: 'Beer',
        price: 0.5,
        quantity: 6,
        origin: BeerOrigin.NETHERLANDS,
      };
      const order = {
        items: [breadDto, vegetableDto, beerDto],
      };
      const createReceiptDto: CreateReceiptDto = {
        order,
      };
      const receiptEntity = new Receipt();
      jest.spyOn(orderRepository, 'create').mockReturnValue({} as Order);
      jest.spyOn(itemRepository, 'create').mockReturnValue({} as Item);

      // WHEN
      jest.spyOn(discountService, 'calculateDiscount').mockReturnValue(0);
      jest.spyOn(receiptRepository, 'create').mockReturnValue(receiptEntity);
      jest.spyOn(receiptRepository, 'save').mockResolvedValue(receiptEntity);

      const result = await receiptService.create(createReceiptDto);

      // THEN
      expect(result).toEqual(receiptEntity);
      expect(receiptRepository.create).toHaveBeenCalled();
      expect(receiptRepository.save).toHaveBeenCalledWith(receiptEntity);
    });
  });

  /* GENERATE FORMATTED RECEIPT */
  describe('generateFormattedReceipt', () => {
    it('should generate a formatted receipt', async () => {
      // GIVEN
      const breadItem = {
        id: 1,
        order: null,
        type: ItemType.BREAD,
        name: 'Bread',
        price: 2.0,
        quantity: 3,
        ageInDays: 3,
      };
      const vegetableItem = {
        id: 2,
        order: null,
        type: ItemType.VEGETABLE,
        name: 'Vegetables',
        price: 2,
        weight: 200,
      };
      const beerItem = {
        id: 3,
        order: null,
        type: ItemType.BEER,
        name: 'Beer',
        price: 2.0,
        quantity: 6,
        origin: BeerOrigin.NETHERLANDS,
      };
      const receipt: Receipt = {
        id: 1,
        order: {
          id: 1,
          receipt: null,
          items: [breadItem, vegetableItem, beerItem],
        },
      };

      jest.spyOn(receiptRepository, 'findOne').mockResolvedValue(receipt);

      // Spy on discount service
      jest
        .spyOn(discountService, 'calculateDiscount')
        .mockImplementation((item) => {
          if (item.type === ItemType.BREAD) {
            const BUY_1_TAKE_2_DISCOUNT = item.price;
            return BUY_1_TAKE_2_DISCOUNT;
          } else if (item.type === ItemType.VEGETABLE) {
            const SEVEN_PERCENT_DISCOUNT = parseFloat(
              (item.price * 0.07).toFixed(1),
            );
            const quantity = item.weight / 100;
            return quantity * SEVEN_PERCENT_DISCOUNT;
          } else if (item.type === ItemType.BEER) {
            const TWO_EUROS = 2.0;
            return TWO_EUROS;
          } else {
            return 0;
          }
        });

      // WHEN
      const result = await receiptService.generateFormattedReceipt();

      // THEN
      expect(result).toEqual(
        `Receipt\n1.\t 3 x Bread (3 days old) \t\t €2.00\n2.\t 200g Vegetable \t\t €2.00\n3.\t 6 x Dutch Beers \t\t €2.00\nTotal: €17.80`,
      );
    });
  });

  /* GENERATE ITEM NAME */
  describe('generateItemName', () => {
    it('should generate the name of an item', () => {
      // GIVEN
      const breadItem = {
        id: 1,
        order: null,
        type: ItemType.BREAD,
        name: 'Bread',
        price: 2.0,
        quantity: 3,
        ageInDays: 3,
      };
      const freshBreadItem = {
        id: 1,
        order: null,
        type: ItemType.BREAD,
        name: 'Bread',
        price: 2.0,
        quantity: 3,
        ageInDays: 1,
      };
      const vegetableItem = {
        id: 2,
        order: null,
        type: ItemType.VEGETABLE,
        name: 'Vegetables',
        price: 1.86,
        weight: 200,
      };
      const beerItem = {
        id: 3,
        order: null,
        type: ItemType.BEER,
        name: 'Beer',
        price: 2.0,
        quantity: 6,
        origin: BeerOrigin.NETHERLANDS,
      };

      // WHEN
      const breadResult = receiptService.generateItemName(breadItem);
      const freshBreadResult = receiptService.generateItemName(freshBreadItem);
      const vegetableResult = receiptService.generateItemName(vegetableItem);
      const beerResult = receiptService.generateItemName(beerItem);

      // THEN
      expect(breadResult).toEqual('3 x Bread (3 days old)');
      expect(freshBreadResult).toEqual('3 x Bread (Fresh)');
      expect(vegetableResult).toEqual('200g Vegetable');
      expect(beerResult).toEqual('6 x Dutch Beers');
    });
  });

  /* FIND ALL */
  describe('findAll', () => {
    it('should throw an error if no receipts found', async () => {
      // GIVEN
      jest.spyOn(receiptRepository, 'find').mockResolvedValue(null);

      // WHEN
      const promise = receiptService.findAll();

      // THEN
      await expect(promise).rejects.toThrow(
        new Error('Error getting all receipts'),
      );
    });

    it('should return an array of receipts', async () => {
      // GIVEN
      const receipts = [{ id: 1 }, { id: 2 }] as Receipt[];
      jest.spyOn(receiptRepository, 'find').mockResolvedValue(receipts);

      // WHEN
      const result = await receiptService.findAll();

      // THEN
      expect(result).toEqual(receipts);
      expect(receiptRepository.find).toHaveBeenCalled();
    });
  });

  /* FIND ONE */
  describe('findOne', () => {
    it('should throw an error if the receipt is not found', async () => {
      // GIVEN
      jest.spyOn(receiptRepository, 'findOne').mockResolvedValue(null);

      // WHEN
      const promise = receiptService.findOne(1);

      // THEN
      await expect(promise).rejects.toThrow(
        new NotFoundException('Could not find a receipt'),
      );
    });

    it('should return a single receipt', async () => {
      // GIVEN
      const receipt = { id: 1 } as Receipt;
      jest.spyOn(receiptRepository, 'findOne').mockResolvedValue(receipt);

      // WHEN
      const result = await receiptService.findOne(1);

      // THEN
      expect(result).toEqual(receipt);
      expect(receiptRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  /* UPDATE */
  describe('update', () => {
    it('should update a receipt', async () => {
      // GIVEN
      const receipt: Receipt = {
        id: 1,
        order: null,
      };
      const updateReceiptDto = {
        order: {
          items: [{ id: 1 }],
        } as Order,
      };
      jest.spyOn(receiptRepository, 'findOne').mockResolvedValue(receipt);

      // WHEN
      const result = await receiptService.update(1, updateReceiptDto);

      // THEN
      expect(result.order).toEqual(updateReceiptDto.order);
      expect(receiptRepository.save).toHaveBeenCalledWith(receipt);
    });

    it('should throw an error if the receipt is not found', async () => {
      // GIVEN
      jest.spyOn(receiptRepository, 'findOne').mockResolvedValue(null);

      // WHEN
      const promise = receiptService.update(1, { order: null });

      // THEN
      await expect(promise).rejects.toThrow(
        new NotFoundException('Could not find a receipt'),
      );
    });
  });

  /* REMOVE */
  describe('remove', () => {
    it('should remove a receipt', async () => {
      // GIVEN
      const receipt: Receipt = { id: 1 } as Receipt;
      jest.spyOn(receiptRepository, 'findOne').mockResolvedValue(receipt);

      // WHEN
      await receiptService.remove(1);

      // THEN
      expect(receiptRepository.remove).toHaveBeenCalledWith(receipt);
    });

    it('should throw an error if the receipt is not found', async () => {
      // GIVEN
      jest.spyOn(receiptRepository, 'findOne').mockResolvedValue(null);

      // WHEN
      const promise = receiptService.remove(1);

      // THEN
      await expect(promise).rejects.toThrow(
        new Error('Could not find a receipt'),
      );
    });
  });

  /* CALCULATE TOTAL */
  describe('calculateTotal', () => {
    it('should calculate the total price of a receipt', async () => {
      const receipt = {
        id: 1,
        order: {
          id: 1,
          items: [
            {
              id: 1,
              type: 'Bread',
              quantity: 1,
              price: 10,
            },
          ],
        },
      };
      const discount = 1;
      mockReceiptRepository.findOne.mockResolvedValue(receipt);
      mockDiscountService.calculateDiscount.mockReturnValue(discount);

      const result = await receiptService.calculateTotal(1);
      expect(result).toEqual(9);
      expect(mockReceiptRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['order', 'order.items'],
      });
      expect(mockDiscountService.calculateDiscount).toHaveBeenCalledWith(
        receipt.order.items[0],
      );
    });

    it('should throw an error if the receipt is not found', async () => {
      mockReceiptRepository.findOne.mockResolvedValue(null);

      await expect(receiptService.calculateTotal(1)).rejects.toThrow(
        new NotFoundException('Could not find receipt'),
      );
    });
  });
});
