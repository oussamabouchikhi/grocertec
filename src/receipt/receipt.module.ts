import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { Order } from '../order/entities/order.entity';
import { DiscountService } from '../discount/discount.service';
import { Item } from '../item/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, Order, Item])],
  controllers: [ReceiptController],
  providers: [ReceiptService, DiscountService],
})
export class ReceiptModule {}
