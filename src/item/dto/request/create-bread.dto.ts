import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBreadDto {
  @ApiProperty({
    description: 'The name of the bread',
    example: 'Whole Wheat Bread',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The age of the bread in days',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  ageInDays: number;

  @ApiProperty({
    description: 'The quantity of the bread',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The price of the bread',
    example: 2.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
