import { PartialType } from '@nestjs/mapped-types';
import { CreateVegetableDto } from './create-vegetable.dto';

export class UpdateVegetableDto extends PartialType(CreateVegetableDto) {}
