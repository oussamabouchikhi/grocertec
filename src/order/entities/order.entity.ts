import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../item/entities/item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Item, (item) => item.order)
  items: Item[];
}
