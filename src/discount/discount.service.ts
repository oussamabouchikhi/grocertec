import { Injectable } from '@nestjs/common';
import { BeerOrigin, ItemType } from '../common/types';
import { Item } from '../item/entities/item.entity';

@Injectable()
export class DiscountService {
  calculateDiscount(item: Item): number {
    switch (item.type) {
      case ItemType.BREAD:
        return this.calculateBreadDiscount(item);
      case ItemType.VEGETABLE:
        return this.calculateVegetableDiscount(item);
      case ItemType.BEER:
        return this.calculateBeerDiscount(item);
      default:
        return 0;
    }
  }

  /**
   * Calculate the discount for bread items
   * @description The discount is based on the age of the bread item, with the following rules:
   * - 0% discount for fresh bread (age <= 1 day)
   * - 100% discount for bread that is 2-3 days old (buy 1 take 2)
   * - 200% discount for bread that is 4-6 days old (buy 1 take 3)
   * - 0% discount for bread older than 6 days
   * @param item The bread item
   * @returns The discount amount
   */
  private calculateBreadDiscount(item: Item): number {
    const NO_DISCOUNT = 0;
    const BUY_1_TAKE_2_DISCOUNT = item.price;
    const BUY_1_TAKE_3_DISCOUNT = parseFloat((item.price * 2).toFixed(2));
    const ageInDays = item.ageInDays || 0;

    if (ageInDays <= 1) {
      return NO_DISCOUNT;
    } else if (ageInDays <= 3) {
      return BUY_1_TAKE_2_DISCOUNT;
    } else if (ageInDays <= 6) {
      return BUY_1_TAKE_3_DISCOUNT;
    }

    return NO_DISCOUNT;
  }

  /**
   * Calculate the discount for vegetable items
   * @description The discount is based on the weight of the vegetable item, with the following rules:
   * - 5% discount for weight <= 100g
   * - 7% discount for 100g < weight <= 500g
   * - 10% discount for weight > 500g
   * @param item The vegetable item
   * @returns The discount amount
   */
  private calculateVegetableDiscount(item) {
    const originalPrice = item.price;
    const FIVE_PERCENT_DISCOUNT = parseFloat((originalPrice * 0.05).toFixed(1));
    const SEVEN_PERCENT_DISCOUNT = parseFloat(
      (originalPrice * 0.07).toFixed(1),
    );
    const TEN_PERCENT_DISCOUNT = parseFloat((originalPrice * 0.1).toFixed(1));
    const HUNDRED_GRAMS = 100;
    const FIVE_HUNDRED_GRAMS = 500;
    const weight = item.weight || 0;
    const quantity = weight / 100;

    if (weight <= HUNDRED_GRAMS) {
      return quantity * FIVE_PERCENT_DISCOUNT;
    } else if (weight <= FIVE_HUNDRED_GRAMS) {
      return quantity * SEVEN_PERCENT_DISCOUNT;
    } else {
      return quantity * TEN_PERCENT_DISCOUNT;
    }
  }

  /**
   * Calculate the discount for beer items
   * @description The discount is based on the origin and pack size of the beer item, with the following rules:
   * - €3.00 discount for each Belgium beer pack (pack size = 6)
   * - €2.00 discount for each Dutch beer pack (pack size = 6)
   * - €4.00 discount for each German beer pack (pack size = 6)
   * - No discount for other origins or single bottles/cans
   * @param item The beer item
   * @returns The discount amount
   */
  private calculateBeerDiscount(item: Item): number {
    const THREE_EUROS = 3.0;
    const TWO_EUROS = 2.0;
    const FOUR_EUROS = 4.0;
    const NO_DISCOUNT = 0;
    const itemQuantity = item.quantity || 0;
    const nbrOfPacks = Math.floor(itemQuantity / 6);
    const isPack = item.quantity >= 6;

    if (isPack) {
      switch (item.origin) {
        case BeerOrigin.BELGIUM:
          return nbrOfPacks * THREE_EUROS;
        case BeerOrigin.NETHERLANDS:
          return nbrOfPacks * TWO_EUROS;
        case BeerOrigin.GERMANY:
          return nbrOfPacks * FOUR_EUROS;
        default:
          return NO_DISCOUNT;
      }
    }

    return NO_DISCOUNT;
  }
}
