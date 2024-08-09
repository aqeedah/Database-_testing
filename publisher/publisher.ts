import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Publisher {
    @PrimaryGeneratedColumn()
    publisher_id!: number;

    @Column({ type: 'varchar', length: 50 })
    publisher_name!: string;
}
