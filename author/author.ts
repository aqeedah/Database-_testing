import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Author {
    @PrimaryGeneratedColumn()
    author_id!: number;

    @Column({ type: 'varchar', length: 20 })
    first_name!: string;

    @Column({ type: 'varchar', length: 20 })
    last_name!: string;

    @Column({ type: 'varchar', length: 20 })
    email_address!: string;
}
