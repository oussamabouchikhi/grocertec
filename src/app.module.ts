import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreadModule } from './bread/bread.module';
import { BeerModule } from './beer/beer.module';

@Module({
  imports: [BreadModule, BeerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
