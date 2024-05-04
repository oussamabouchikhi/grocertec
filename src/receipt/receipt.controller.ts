import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/request/create-receipt.dto';
import { UpdateReceiptDto } from './dto/request/update-receipt.dto';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  create(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptService.create(createReceiptDto);
  }

  @Get()
  findAll() {
    return this.receiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.receiptService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateReceiptDto: UpdateReceiptDto) {
    return this.receiptService.update(id, updateReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.receiptService.remove(id);
  }
}
