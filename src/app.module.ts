import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreadModule } from './bread/bread.module';
import { BeerModule } from './beer/beer.module';
import { VegetableModule } from './vegetable/vegetable.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [BreadModule, BeerModule, VegetableModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
