import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountModule } from '../discount/discount.module';
import { Item } from '../item/entities/item.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Item]), DiscountModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
