import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Author } from '../author/author';
import { Publisher } from '../publisher/publisher';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    book_id!: number;

    @Column({ type: 'varchar', length: 30 })
    book_title!: string;

    @Column({ type: 'varchar', length: 20 })
    book_genre!: string;

    @Column({ type: 'varchar', length: 20 })
    book_type!: string;

    @Column({ type: 'date' })
    publication_date!: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @ManyToOne(() => Author)
    @JoinColumn({ name: 'author_id' })
    author!: Author;

    @ManyToOne(() => Publisher)
    @JoinColumn({ name: 'publisher_id' })
    publisher!: Publisher;

    @Column({ type: 'varchar', length: 15 })
    isbn!: string;
}
