import { Express } from 'express';
import { DataSource } from 'typeorm';
import { Book } from './book';
import { Author } from '../author/author';
import { Publisher } from '../publisher/publisher';

export default class BookApi {
    #dataSource: DataSource;
    #express: Express;

    constructor(dataSource: DataSource, express: Express) {
        this.#dataSource = dataSource;
        this.#express = express;
        this.setupRoutes();
    }

    setupRoutes() {
        this.#express.get('/book/:id', async (req, res) => {
            const book = await this.#dataSource.manager.findOneBy(Book, {
                book_id: parseInt(req.params.id),
            });
            if (book) {
                res.json(book);
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        });

        this.#express.post('/book', async (req, res) => {
            const { body } = req;
            console.log('Request body:', body);

            const book = new Book();
            book.book_title = body.book_title;
            book.book_genre = body.book_genre;
            book.book_type = body.book_type;
            book.publication_date = body.publication_date;
            book.price = body.price;
            book.isbn = body.isbn;

            const author = await this.#dataSource.manager.findOneBy(Author, {
                author_id: body.author_id,
            });
            if (author) {
                book.author = author;
            } else {
                return res.status(404).json({ error: 'Author not found' });
            }

            const publisher = await this.#dataSource.manager.findOneBy(Publisher, {
                publisher_id: body.publisher_id,
            });
            if (publisher) {
                book.publisher = publisher;
            } else {
                return res.status(404).json({ error: 'Publisher not found' });
            }

            try {
                const savedBook = await this.#dataSource.manager.save(book);
                console.log(`Book has been created with id: ${savedBook.book_id}`);
                res.status(200).json({ id: savedBook.book_id });
            } catch (err) {
                console.error('Error saving book:', err);
                res.status(503).json({ error: 'Book creation failed in db.' });
            }
        });

        // Update book data
        this.#express.put('/book/:id', async (req, res) => {
            const { body } = req;
            const book = await this.#dataSource.manager.findOneBy(Book, {
                book_id: parseInt(req.params.id),
            });

            if (book) {
                book.book_title = body.book_title || book.book_title;
                book.book_genre = body.book_genre || book.book_genre;
                book.book_type = body.book_type || book.book_type;
                book.publication_date = body.publication_date || book.publication_date;
                book.price = body.price || book.price;
                book.isbn = body.isbn || book.isbn;

                const author = await this.#dataSource.manager.findOneBy(Author, {
                    author_id: body.author_id,
                });
                if (author) {
                    book.author = author;
                } else {
                    return res.status(404).json({ error: 'Author not found' });
                }

                const publisher = await this.#dataSource.manager.findOneBy(Publisher, {
                    publisher_id: body.publisher_id,
                });
                if (publisher) {
                    book.publisher = publisher;
                } else {
                    return res.status(404).json({ error: 'Publisher not found' });
                }

                try {
                    await this.#dataSource.manager.save(book);
                    console.log(`Book with id: ${book.book_id} has been updated`);
                    res.status(200).json({ message: 'Book updated successfully' });
                } catch (err) {
                    res.status(503).json({ error: 'Book update failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        });

        // Delete book data
        this.#express.delete('/book/:id', async (req, res) => {
            const book = await this.#dataSource.manager.findOneBy(Book, {
                book_id: parseInt(req.params.id),
            });

            if (book) {
                try {
                    console.log('Book found:', book); // Add this line to log the book object
                    await this.#dataSource.manager.remove(book);
                    console.log(`Book with id: ${book.book_id} has been deleted`);
                    res.status(200).json({ message: 'Book deleted successfully' });
                } catch (err) {
                    console.error('Error deleting book:', err); // Add this line to log the error
                    res.status(503).json({ error: 'Book deletion failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        });
    }
}
