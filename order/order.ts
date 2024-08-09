import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../customer/customer';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    order_id!: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer!: Customer;

    @Column({ type: 'date' })
    order_date!: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    bill_amount!: number;
}
