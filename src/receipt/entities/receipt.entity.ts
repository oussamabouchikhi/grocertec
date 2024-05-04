import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, (order) => order.receipt)
  @JoinColumn()
  order: Order;
}
