import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreadModule } from './bread/bread.module';
import { BeerModule } from './beer/beer.module';
import { VegetableModule } from './vegetable/vegetable.module';

@Module({
  imports: [BreadModule, BeerModule, VegetableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
