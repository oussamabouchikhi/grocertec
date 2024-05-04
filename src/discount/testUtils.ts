import { BeerOrigin, ItemType } from '../common/types';
import { Item } from '../item/entities/item.entity';

export const createBreadItem = ({
  id = 1,
  order = {
    id: 0,
    items: [],
    receipt: null,
  },
  name = 'Bread',
  ageInDays = 1,
  price = 5,
}: Partial<Item>): Item => ({
  id,
  order,
  name,
  type: ItemType.BREAD,
  ageInDays,
  price,
});

export const createVegetableItem = ({
  id = 1,
  order = {
    id: 0,
    items: [],
    receipt: null,
  },
  name = 'Vegetable',
  weight = 100,
  price = 10,
}: Partial<Item>): Item => ({
  id,
  order,
  name,
  type: ItemType.VEGETABLE,
  weight,
  price,
});

export const createBeerItem = ({
  id = 1,
  order = {
    id: 0,
    items: [],
    receipt: null,
  },
  name = 'Beer',
  origin = BeerOrigin.BELGIUM,
  price = 10,
  quantity = 6,
}: Partial<Item>): Item => ({
  id,
  order,
  name,
  type: ItemType.BEER,
  origin,
  price,
  quantity,
});

export const createUnkownItem = ({
  id = 1,
  order = {
    id: 0,
    items: [],
    receipt: null,
  },
  name = 'Unknown',
  price = 10,
}: Partial<Item>): Item => ({
  id,
  order,
  name,
  price,
  type: 'Unknown' as ItemType,
});
