import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreadModule } from './bread/bread.module';
import { BeerModule } from './beer/beer.module';
import { VegetableModule } from './vegetable/vegetable.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [BreadModule, BeerModule, VegetableModule, ItemModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
