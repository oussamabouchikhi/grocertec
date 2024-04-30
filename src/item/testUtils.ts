import { BeerOrigin, ItemType } from '../common/types';
import { CreateBeerDto } from './dto/request/create-beer.dto';
import { CreateBreadDto } from './dto/request/create-bread.dto';
import { CreateItemDto } from './dto/request/create-item.dto';
import { CreateVegetableDto } from './dto/request/create-vegetable.dto';
import { Item } from './entities/item.entity';

export function createBreadDtoFactory({
  name = 'Bread',
  ageInDays = 2,
}: {
  name?: string;
  ageInDays?: number;
}): CreateBreadDto {
  return {
    name,
    ageInDays,
  };
}

export function createVegetableDtoFactory({
  name = 'Carrot',
  weight = 1,
}: {
  name?: string;
  weight?: number;
}): CreateVegetableDto {
  return {
    name,
    weight,
  };
}

export function createBeerDtoFactory({
  name = 'Beer',
  origin = BeerOrigin.BELGIUM,
  quantity = 1,
}: {
  name?: string;
  origin?: BeerOrigin;
  quantity?: number;
}): CreateBeerDto {
  return {
    name,
    origin,
    quantity,
  };
}

export function createItemFactory(dto: any, type: ItemType): Item {
  switch (type) {
    case ItemType.BREAD:
      return {
        id: 1,
        order: null,
        receipt: null,
        price: 100,
        type: ItemType.BREAD,
        ...dto,
      };
    case ItemType.VEGETABLE:
      return {
        id: 1,
        order: null,
        receipt: null,
        price: 50,
        type: ItemType.VEGETABLE,
        ...dto,
      };
    case ItemType.BEER:
      return {
        id: 1,
        order: null,
        receipt: null,
        price: 200,
        type: ItemType.BEER,
        ...dto,
      };
    default:
      throw new Error('Invalid item type');
  }
}

export function createItemWithBreadDto({
  price = 100,
}: {
  price?: number;
}): CreateBreadDto & {
  price: number;
  type: ItemType.BREAD;
} {
  const createBreadDto = createBreadDtoFactory({});
  return { ...createBreadDto, price, type: ItemType.BREAD };
}

export function createItemWithVegetableDto({
  price = 50,
}: {
  price?: number;
}): CreateVegetableDto & {
  price: number;
  type: ItemType.VEGETABLE;
} {
  const createVegetableDto = createVegetableDtoFactory({});
  return { ...createVegetableDto, price, type: ItemType.VEGETABLE };
}

export function createItemWithBeerDto({
  price = 200,
}: {
  price?: number;
}): CreateItemDto & {
  type: ItemType.BEER;
} {
  const createBeerDto = createBeerDtoFactory({});
  return { ...createBeerDto, price, type: ItemType.BEER };
}
