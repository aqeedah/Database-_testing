import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../order/order';
import { Book } from '../book/book';

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    order_item_id!: number;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order!: Order;

    @ManyToOne(() => Book)
    @JoinColumn({ name: 'book_id' })
    book!: Book;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;
}
