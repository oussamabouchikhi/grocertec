import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BeerOrigin, ItemType } from '../../common/types';
import { Order } from '../../order/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Item {
  @ApiProperty({
    name: 'id',
    type: 'number',
    example: '1',
    description: 'The unique identifier for the item',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    name: 'order',
    example: {
      id: 1,
      items: [
        {
          id: 1,
          type: 'Bread',
          name: 'Whole Wheat Bread',
          price: 1.0,
          quantity: 3,
          ageInDays: 3,
        },
      ],
    },
    description: 'The order associated with the item',
  })
  @ManyToOne(() => Order, (order) => order.items)
  order?: Order;

  @ApiProperty({
    name: 'name',
    type: 'string',
    example: 'Whole Wheat Bread',
    description: 'The name of the item',
  })
  @Column()
  name: string;

  @ApiProperty({
    name: 'type',
    enum: ItemType,
    example: 'Bread',
    description: 'The type of the item (Bread, Vegetable, Beer)',
  })
  @Column({ enum: ItemType })
  type: ItemType;

  @ApiProperty({
    name: 'price',
    type: 'number',
    example: 1.0,
    description: 'The price of the item',
  })
  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @ApiProperty({
    name: 'ageInDays',
    type: 'number',
    example: 3,
    description: 'The age of the item in days',
  })
  // Bread-specific properties
  @Column({ nullable: true })
  ageInDays?: number;

  @ApiProperty({
    name: 'weight',
    type: 'number',
    example: 30,
    description: 'The weight of the item',
  })
  // Vegetable-specific properties
  @Column({ nullable: true })
  weight?: number;

  @ApiProperty({
    name: 'origin',
    enum: BeerOrigin,
    example: 'Domestic',
    description: 'The origin of the beer item (Dutch, German, Belgian)',
  })
  // Beer-specific properties
  @Column({ nullable: true })
  origin?: BeerOrigin;

  @ApiProperty({
    name: 'quantity',
    type: 'number',
    example: 3,
    description: 'The quantity of the item',
  })
  @Column({ nullable: true })
  quantity?: number;
}
