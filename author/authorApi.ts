import { Express } from 'express';
import { DataSource } from 'typeorm';
import { Author } from '../author/author';

export default class AuthorApi {
    #dataSource: DataSource;
    #express: Express;

    constructor(dataSource: DataSource, express: Express) {
        this.#dataSource = dataSource;
        this.#express = express;
        this.setupRoutes();
    }

    setupRoutes() {
        this.#express.get('/author/:id', async (req, res) => {
            const author = await this.#dataSource.manager.findOneBy(Author, {
                author_id: parseInt(req.params.id),
            });
            if (author) {
                res.json(author);
            } else {
                res.status(404).json({ error: 'Author not found' });
            }
        });

        this.#express.post('/author', async (req, res) => {
            const { body } = req;
            console.log('Request body:', body);

            const author = new Author();
            author.first_name = body.first_name;
            author.last_name = body.last_name;
            author.email_address = body.email_address;

            try {
                const savedAuthor = await this.#dataSource.manager.save(author);
                console.log(`Author has been created with id: ${savedAuthor.author_id}`);
                res.status(200).json({ id: savedAuthor.author_id });
            } catch (err) {
                console.error('Error saving author:', err);
                res.status(503).json({ error: 'Author creation failed in db.' });
            }
        });

        // Update author data
        this.#express.put('/author/:id', async (req, res) => {
            const { body } = req;
            const author = await this.#dataSource.manager.findOneBy(Author, {
                author_id: parseInt(req.params.id),
            });

            if (author) {
                author.first_name = body.first_name || author.first_name;
                author.last_name = body.last_name || author.last_name;
                author.email_address = body.email_address || author.email_address;

                try {
                    await this.#dataSource.manager.save(author);
                    console.log(`Author with id: ${author.author_id} has been updated`);
                    res.status(200).json({ message: 'Author updated successfully' });
                } catch (err) {
                    res.status(503).json({ error: 'Author update failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Author not found' });
            }
        });

        // Delete author data
        this.#express.delete('/author/:id', async (req, res) => {
            const author = await this.#dataSource.manager.findOneBy(Author, {
                author_id: parseInt(req.params.id),
            });

            if (author) {
                try {
                    console.log('Author found:', author); // Add this line to log the author object
                    await this.#dataSource.manager.remove(author);
                    console.log(`Author with id: ${author.author_id} has been deleted`);
                    res.status(200).json({ message: 'Author deleted successfully' });
                } catch (err) {
                    console.error('Error deleting author:', err); // Add this line to log the error
                    res.status(503).json({ error: 'Author deletion failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Author not found' });
            }
        });
    }
}
