import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    customer_id!: number;

    @Column({ type: 'varchar', length: 20 })
    first_name!: string;

    @Column({ type: 'varchar', length: 20 })
    last_name!: string;

    @Column({ type: 'varchar', length: 20 })
    contact_number!: string;

    @Column({ type: 'varchar', length: 100 })
    address!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_spent_amount!: number;

    @Column({ type: 'date' })
    registration_date!: Date;
}
