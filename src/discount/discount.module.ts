import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';

@Module({
  providers: [DiscountService],
})
export class DiscountModule {}
