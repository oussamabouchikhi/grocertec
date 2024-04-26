import { Module } from '@nestjs/common';
import { BreadService } from './bread.service';
import { BreadController } from './bread.controller';

@Module({
  controllers: [BreadController],
  providers: [BreadService],
})
export class BreadModule {}
