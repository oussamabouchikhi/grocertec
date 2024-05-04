import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Item, (item) => item.order)
  items: Item[];

  @OneToOne(() => Receipt, (receipt) => receipt.order)
  receipt: Receipt;
}
