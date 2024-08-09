import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../customer/customer';
import { Book } from '../book/book';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    review_id!: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer!: Customer;

    @ManyToOne(() => Book)
    @JoinColumn({ name: 'book_id' })
    book!: Book;

    @Column({ type: 'date' })
    review_date!: Date;

    @Column({ type: 'text' })
    review_comment!: string;

    @Column({ type: 'int' })
    ratings!: number;
}
