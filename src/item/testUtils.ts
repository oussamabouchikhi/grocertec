import { BeerOrigin, ItemType } from '../common/types';
import { CreateBeerDto } from './dto/request/create-beer.dto';
import { CreateBreadDto } from './dto/request/create-bread.dto';
import { CreateItemDto } from './dto/request/create-item.dto';
import { CreateVegetableDto } from './dto/request/create-vegetable.dto';
import { Item } from './entities/item.entity';

export function createBreadDtoFactory({
  name = 'Bread',
  ageInDays = 2,
  price = 2.99,
  quantity = 1,
}: {
  name?: string;
  ageInDays?: number;
  price?: number;
  quantity?: number;
}): CreateBreadDto {
  return {
    name,
    ageInDays,
    price,
    quantity,
  };
}

export function createVegetableDtoFactory({
  name = 'Carrot',
  weight = 1,
  price = 1.99,
}: {
  name?: string;
  weight?: number;
  price?: number;
}): CreateVegetableDto {
  return {
    name,
    weight,
    price,
  };
}

export function createBeerDtoFactory({
  name = 'Beer',
  origin = BeerOrigin.BELGIUM,
  quantity = 1,
  price = 2.99,
}: {
  name?: string;
  origin?: BeerOrigin;
  quantity?: number;
  price?: number;
}): CreateBeerDto {
  return {
    name,
    origin,
    quantity,
    price,
  };
}

export function createItemFactory(dto: any, type: ItemType): Item {
  switch (type) {
    case ItemType.BREAD:
      return {
        id: 1,
        order: null,
        receipt: null,
        type: ItemType.BREAD,
        ...dto,
      };
    case ItemType.VEGETABLE:
      return {
        id: 1,
        order: null,
        receipt: null,
        type: ItemType.VEGETABLE,
        ...dto,
      };
    case ItemType.BEER:
      return {
        id: 1,
        order: null,
        receipt: null,
        type: ItemType.BEER,
        ...dto,
      };
    default:
      throw new Error('Invalid item type');
  }
}

export function createItemWithBreadDto(): CreateBreadDto & {
  type: ItemType.BREAD;
} {
  const createBreadDto = createBreadDtoFactory({});
  return { ...createBreadDto, type: ItemType.BREAD };
}

export function createItemWithVegetableDto(): CreateVegetableDto & {
  price: number;
  type: ItemType.VEGETABLE;
} {
  const createVegetableDto = createVegetableDtoFactory({});
  return { ...createVegetableDto, type: ItemType.VEGETABLE };
}

export function createItemWithBeerDto(): CreateItemDto & {
  type: ItemType.BEER;
} {
  const createBeerDto = createBeerDtoFactory({});
  return { ...createBeerDto, type: ItemType.BEER };
}
