import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { BeerOrigin, ItemType } from '../../../common/types';

export class CreateItemDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Whole Wheat Bread',
  })
  name: string;

  @ApiProperty({
    name: 'type',
    description: 'The type of the item (Bread, Vegetable, Beer)',
    enum: ItemType,
    example: ItemType.BREAD,
  })
  @IsNotEmpty()
  @IsEnum(ItemType)
  type: ItemType;

  @ApiProperty({
    name: 'price',
    description: 'The price of the item',
    example: 2.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  // Bread-specific properties
  @ApiProperty({
    name: 'ageInDays',
    description: 'The age of the bread in days (if applicable)',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ageInDays?: number;

  // Vegetable-specific properties
  @ApiProperty({
    name: 'weight',
    description: 'The weight of the vegetable in grams (if applicable)',
    example: 200,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  // Beer-specific properties
  @ApiProperty({
    name: 'origin',
    description: 'The origin of the beer (if applicable)',
    example: BeerOrigin.GERMANY,
    required: false,
  })
  @IsOptional()
  @IsEnum(BeerOrigin)
  origin?: BeerOrigin;

  @ApiProperty({
    name: 'quantity',
    description: 'The quantity of the beer (if applicable)',
    example: 6,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
