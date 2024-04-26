import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreadModule } from './bread/bread.module';

@Module({
  imports: [BreadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
