import { Test, TestingModule } from '@nestjs/testing';
import { BeerOrigin } from '../common/types';
import { Item } from '../item/entities/item.entity';
import { DiscountService } from './discount.service';
import {
  createBeerItem,
  createBreadItem,
  createUnkownItem,
  createVegetableItem,
} from './testUtils';

describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountService],
    }).compile();

    service = module.get(DiscountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateDiscount', () => {
    it('should calculate discount for bread items correctly', () => {
      const freshBread = createBreadItem({
        ageInDays: 1,
        price: 5,
      });
      const twoDayOldBread = createBreadItem({
        ageInDays: 2,
        price: 5,
      });
      const fiveDayOldBread = createBreadItem({
        ageInDays: 5,
        price: 5,
      });
      const oldBread = createBreadItem({
        ageInDays: 7,
        price: 5,
      });

      expect(service.calculateDiscount(freshBread)).toBe(0);
      expect(service.calculateDiscount(twoDayOldBread)).toBe(5);
      expect(service.calculateDiscount(fiveDayOldBread)).toBe(10);
      expect(service.calculateDiscount(oldBread)).toBe(0);
    });

    it('should calculate discount for vegetable items correctly', () => {
      const smallVegetable = createVegetableItem({
        weight: 50,
        price: 10,
      });
      const mediumVegetable = createVegetableItem({
        weight: 250,
        price: 10,
      });
      const largeVegetable = createVegetableItem({
        weight: 600,
        price: 10,
      });

      expect(service.calculateDiscount(smallVegetable)).toBe(0.5);
      expect(service.calculateDiscount(mediumVegetable)).toBe(0.7);
      expect(service.calculateDiscount(largeVegetable)).toBe(1);
    });

    it('should calculate discount for beer items correctly', () => {
      const belgiumBeer = createBeerItem({
        origin: BeerOrigin.BELGIUM,
        quantity: 6,
      });
      const dutchBeer = createBeerItem({
        origin: BeerOrigin.NETHERLANDS,
        quantity: 6,
      });
      const germanBeer = createBeerItem({
        origin: BeerOrigin.GERMANY,
        quantity: 6,
      });
      const singleBeer = createBeerItem({
        origin: BeerOrigin.GERMANY,
        quantity: 1,
      });

      expect(service.calculateDiscount(belgiumBeer)).toBe(3);
      expect(service.calculateDiscount(dutchBeer)).toBe(2);
      expect(service.calculateDiscount(germanBeer)).toBe(4);
      expect(service.calculateDiscount(singleBeer)).toBe(0);
    });

    it('should return 0 discount for unknown item types', () => {
      const unknownItem: Item = createUnkownItem({});

      expect(service.calculateDiscount(unknownItem)).toBe(0);
    });
  });
});
