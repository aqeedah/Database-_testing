import { Express } from 'express';
import { DataSource } from 'typeorm';
import { Publisher } from '../publisher/publisher';

export default class PublisherApi {
    #dataSource: DataSource;
    #express: Express;

    constructor(dataSource: DataSource, express: Express) {
        this.#dataSource = dataSource;
        this.#express = express;
        this.setupRoutes();
    }

    setupRoutes() {
        this.#express.get('/publisher/:id', async (req, res) => {
            const publisher = await this.#dataSource.manager.findOneBy(Publisher, {
                publisher_id: parseInt(req.params.id),
            });
            if (publisher) {
                res.json(publisher);
            } else {
                res.status(404).json({ error: 'Publisher not found' });
            }
        });

        this.#express.post('/publisher', async (req, res) => {
            const { body } = req;
            console.log('Request body:', body);

            const publisher = new Publisher();
            publisher.publisher_name = body.publisher_name;

            try {
                const savedPublisher = await this.#dataSource.manager.save(publisher);
                console.log(`Publisher has been created with id: ${savedPublisher.publisher_id}`);
                res.status(200).json({ id: savedPublisher.publisher_id });
            } catch (err) {
                console.error('Error saving publisher:', err);
                res.status(503).json({ error: 'Publisher creation failed in db.' });
            }
        });

        // Update publisher data
        this.#express.put('/publisher/:id', async (req, res) => {
            const { body } = req;
            const publisher = await this.#dataSource.manager.findOneBy(Publisher, {
                publisher_id: parseInt(req.params.id),
            });

            if (publisher) {
                publisher.publisher_name = body.publisher_name || publisher.publisher_name;

                try {
                    await this.#dataSource.manager.save(publisher);
                    console.log(`Publisher with id: ${publisher.publisher_id} has been updated`);
                    res.status(200).json({ message: 'Publisher updated successfully' });
                } catch (err) {
                    res.status(503).json({ error: 'Publisher update failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Publisher not found' });
            }
        });

        // Delete publisher data
        this.#express.delete('/publisher/:id', async (req, res) => {
            const publisher = await this.#dataSource.manager.findOneBy(Publisher, {
                publisher_id: parseInt(req.params.id),
            });

            if (publisher) {
                try {
                    console.log('Publisher found:', publisher); // Add this line to log the publisher object
                    await this.#dataSource.manager.remove(publisher);
                    console.log(`Publisher with id: ${publisher.publisher_id} has been deleted`);
                    res.status(200).json({ message: 'Publisher deleted successfully' });
                } catch (err) {
                    console.error('Error deleting publisher:', err); // Add this line to log the error
                    res.status(503).json({ error: 'Publisher deletion failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Publisher not found' });
            }
        });
    }
}
