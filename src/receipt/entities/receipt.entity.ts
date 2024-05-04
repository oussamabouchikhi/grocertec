import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Receipt {
  @ApiProperty({
    name: 'id',
    example: '1',
    description: 'The unique identifier for the receipt',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    name: 'order',
    example: {
      order: {
        id: 1,
        items: [
          {
            type: 'Bread',
            name: 'Whole Wheat Bread',
            price: 1.0,
            quantity: 3,
            ageInDays: 3,
          },
        ],
      },
    },
    description: 'The order associated with the receipt',
  })
  @OneToOne(() => Order, (order) => order.receipt)
  @JoinColumn()
  order: Order;
}
