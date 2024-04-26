import { PartialType } from '@nestjs/mapped-types';
import { CreateBreadDto } from './create-bread.dto';

export class UpdateBreadDto extends PartialType(CreateBreadDto) {}
