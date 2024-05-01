// testUtils.ts
import { BeerOrigin, ItemType } from '../common/types';
import { Item } from '../item/entities/item.entity';

export const createBreadItem = ({
  id = 1,
  receipt = {
    id: 0,
    items: [],
  },
  order = {
    id: 0,
    items: [],
  },
  name = 'Bread',
  ageInDays = 1,
  price = 5,
}: Partial<Item>): Item => ({
  id,
  receipt,
  order,
  name,
  type: ItemType.BREAD,
  ageInDays,
  price,
});

export const createVegetableItem = ({
  id = 1,
  receipt = {
    id: 0,
    items: [],
  },
  order = {
    id: 0,
    items: [],
  },
  name = 'Vegetable',
  weight = 100,
  price = 10,
}: Partial<Item>): Item => ({
  id,
  receipt,
  order,
  name,
  type: ItemType.VEGETABLE,
  weight,
  price,
});

export const createBeerItem = ({
  id = 1,
  receipt = {
    id: 0,
    items: [],
  },
  order = {
    id: 0,
    items: [],
  },
  name = 'Beer',
  origin = BeerOrigin.BELGIUM,
  price = 10,
  quantity = 6,
}: Partial<Item>): Item => ({
  id,
  receipt,
  order,
  name,
  type: ItemType.BEER,
  origin,
  price,
  quantity,
});

export const createUnkownItem = ({
  id = 1,
  receipt = {
    id: 0,
    items: [],
  },
  order = {
    id: 0,
    items: [],
  },
  name = 'Unknown',
  price = 10,
}: Partial<Item>): Item => ({
  id,
  receipt,
  order,
  name,
  price,
  type: 'Unknown' as ItemType,
});
