import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVegetableDto {
  @ApiProperty({
    description: 'The name of the vegetable',
    example: 'Carrot',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The weight of the vegetable in grams',
    example: 300,
  })
  @IsNotEmpty()
  @IsNumber()
  weight: number;
}
