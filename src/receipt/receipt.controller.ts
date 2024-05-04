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
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @ApiBody({
    examples: {
      bread: {
        value: {
          order: {
            items: [
              {
                type: 'Bread',
                name: 'Bread',
                price: 1.0,
                quantity: 3,
                ageInDays: 3,
              },
            ],
          },
        },
      },
    },
    type: CreateReceiptDto,
    description: 'The receipt to be created.',
  })
  @ApiResponse({
    status: 201,
    description: 'The receipt has been successfully created.',
  })
  @Post()
  create(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptService.create(createReceiptDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The receipts have been successfully retrieved.',
  })
  @Get()
  findAll() {
    return this.receiptService.findAll();
  }

  @ApiParam({
    name: 'id',
    description: 'The id of the receipt to be retrieved.',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The receipt has been successfully retrieved.',
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.receiptService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    description: 'The id of the receipt to be updated.',
    example: 1,
    type: 'number',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateReceiptDto: UpdateReceiptDto) {
    return this.receiptService.update(id, updateReceiptDto);
  }

  @ApiParam({
    name: 'id',
    description: 'The id of the receipt to be removed.',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 204,
    description: 'The receipt has been successfully removed.',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.receiptService.remove(id);
  }
}
