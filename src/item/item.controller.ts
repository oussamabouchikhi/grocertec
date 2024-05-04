import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/request/create-item.dto';
import { UpdateItemDto } from './dto/request/update-item.dto';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiBody({
    examples: {
      carrot: {
        value: {
          name: 'Carrot',
          type: 'Vegetable',
          price: 10,
          weight: 30,
        },
      },
    },
    type: CreateItemDto,
    description: 'The item to be created.',
  })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created.',
    type: CreateItemDto,
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            name: 'Carrot',
            type: 'Vegetable',
            price: 10,
            weight: 30,
            ageInDays: null,
            origin: null,
            quantity: null,
          },
        },
      },
    },
  })
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The items have been successfully retrieved.',
    type: [CreateItemDto],
    content: {
      'application/json': {
        schema: {
          example: [
            {
              id: 1,
              name: 'Carrot',
              type: 'Vegetable',
              price: 10,
              weight: 30,
              ageInDays: null,
              origin: null,
              quantity: null,
            },
          ],
        },
      },
    },
  })
  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @ApiParam({
    name: 'id',
    description: 'The id of the item to be retrieved.',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully retrieved.',
    type: CreateItemDto,
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            name: 'Carrot',
            type: 'Vegetable',
            price: 10,
            weight: 30,
            ageInDays: null,
            origin: null,
            quantity: null,
          },
        },
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.itemService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    description: 'The id of the item to be updated.',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated.',
    type: CreateItemDto,
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            name: 'Carrot',
            type: 'Vegetable',
            price: 10,
            weight: 30,
            ageInDays: null,
            origin: null,
            quantity: null,
          },
        },
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @ApiParam({
    name: 'id',
    description: 'The id of the item to be removed.',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully removed.',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.itemService.remove(id);
  }
}
