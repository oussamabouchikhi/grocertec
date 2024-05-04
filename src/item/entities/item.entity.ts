import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BeerOrigin, ItemType } from '../../common/types';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  order?: Order;

  @Column()
  name: string;

  @Column({ enum: ItemType })
  type: ItemType;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  // Bread-specific properties
  @Column({ nullable: true })
  ageInDays?: number;

  // Vegetable-specific properties
  @Column({ nullable: true })
  weight?: number;

  // Beer-specific properties
  @Column({ nullable: true })
  origin?: BeerOrigin;

  @Column({ nullable: true })
  quantity?: number;
}
