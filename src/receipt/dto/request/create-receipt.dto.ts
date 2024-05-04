import { IsNotEmpty } from 'class-validator';
import { CreateItemDto } from 'src/item/dto/request/create-item.dto';

export class CreateReceiptDto {
  @IsNotEmpty()
  order: Order;
}

export interface Order {
  items: CreateItemDto[];
}
