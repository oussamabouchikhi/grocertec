import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { Item } from '../item/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, Item])],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
