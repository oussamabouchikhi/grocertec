import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBreadDto {
  @ApiProperty({
    description: 'The name of the bread',
    example: 'Whole Wheat Bread',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The age of the bread in days',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  ageInDays: number;
}
