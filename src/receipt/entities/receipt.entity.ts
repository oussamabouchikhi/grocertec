import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../item/entities/item.entity';

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Item, (item) => item.receipt)
  items: Item[];
}
