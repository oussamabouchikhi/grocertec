import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { BeerOrigin } from '../../../common/types';

export class CreateBeerDto {
  @ApiProperty({
    description: 'The name of the beer',
    example: 'Stella Artois',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The origin of the beer',
    enum: BeerOrigin,
    example: BeerOrigin.BELGIUM,
  })
  @IsNotEmpty()
  @IsEnum(BeerOrigin)
  origin: BeerOrigin;

  @ApiProperty({
    description: 'The quantity of beers',
    example: 6,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The price of the beer',
    example: 2.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
