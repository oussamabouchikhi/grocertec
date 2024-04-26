import { Module } from '@nestjs/common';
import { VegetableService } from './vegetable.service';
import { VegetableController } from './vegetable.controller';

@Module({
  controllers: [VegetableController],
  providers: [VegetableService],
})
export class VegetableModule {}
