import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /*
  export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Item, (item) => item.order)
  items: Item[];

  @OneToOne(() => Receipt, (receipt) => receipt.order)
  receipt: Receipt;
} */
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: Order,
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            items: [
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
            receipt: null,
          },
        },
      },
    },
  })
  @Post()
  create(): Promise<Order> {
    return this.orderService.create();
  }

  @ApiResponse({
    status: 200,
    description: 'The orders have been successfully retrieved.',
    type: Order,
    isArray: true,
    content: {
      'application/json': {
        schema: {
          example: [
            {
              id: 1,
              items: [
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
              receipt: null,
            },
          ],
        },
      },
    },
  })
  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @ApiParam({
    name: 'id',
    description: 'The id of the order to be retrieved.',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully retrieved.',
    type: Order,
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            items: [
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
            receipt: null,
          },
        },
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    description: 'The id of the order to be updated.',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
    type: Order,
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            items: [
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
            receipt: null,
          },
        },
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @ApiParam({
    name: 'id',
    description: 'The id of the order to be removed.',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 204,
    description: 'The order has been successfully removed.',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }
}
