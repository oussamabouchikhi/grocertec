import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Order {
  @ApiProperty({
    name: 'id',
    example: '1',
    type: 'number',
    description: 'The unique identifier for the order',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    name: 'items',
    example: [
      { id: '1', type: 'Bread', price: 2.8, quantity: 3, ageInDays: 3 },
    ],
    description: 'The items in the order',
  })
  @OneToMany(() => Item, (item) => item.order)
  items: Item[];

  @ApiProperty({
    name: 'receipt',
    example: {
      id: 1,
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
    description: 'The receipt associated with the order',
  })
  @OneToOne(() => Receipt, (receipt) => receipt.order)
  receipt: Receipt;
}
