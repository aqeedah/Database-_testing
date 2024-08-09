import { Express } from 'express';
import { DataSource } from 'typeorm';
import { Review } from '../review/review';
import { Customer } from '../customer/customer';
import { Book } from '../book/book';

export default class ReviewApi {
    #dataSource: DataSource;
    #express: Express;

    constructor(dataSource: DataSource, express: Express) {
        this.#dataSource = dataSource;
        this.#express = express;
        this.setupRoutes();
    }

    setupRoutes() {
        this.#express.get('/review/:id', async (req, res) => {
            const review = await this.#dataSource.manager.findOneBy(Review, {
                review_id: parseInt(req.params.id),
            });
            if (review) {
                res.json(review);
            } else {
                res.status(404).json({ error: 'Review not found' });
            }
        });

        this.#express.post('/review', async (req, res) => {
            const { body } = req;
            console.log('Request body:', body);

            const review = new Review();
            review.review_date = body.review_date;
            review.review_comment = body.review_comment;
            review.ratings = body.ratings;

            const customer = await this.#dataSource.manager.findOneBy(Customer, {
                customer_id: body.customer_id,
            });
            if (customer) {
                review.customer = customer;
            } else {
                return res.status(404).json({ error: 'Customer not found' });
            }

            const book = await this.#dataSource.manager.findOneBy(Book, {
                book_id: body.book_id,
            });
            if (book) {
                review.book = book;
            } else {
                return res.status(404).json({ error: 'Book not found' });
            }

            try {
                const savedReview = await this.#dataSource.manager.save(review);
                console.log(`Review has been created with id: ${savedReview.review_id}`);
                res.status(200).json({ id: savedReview.review_id });
            } catch (err) {
                console.error('Error saving review:', err);
                res.status(503).json({ error: 'Review creation failed in db.' });
            }
        });

        // Update review data
        this.#express.put('/review/:id', async (req, res) => {
            const { body } = req;
            const review = await this.#dataSource.manager.findOneBy(Review, {
                review_id: parseInt(req.params.id),
            });

            if (review) {
                review.review_date = body.review_date || review.review_date;
                review.review_comment = body.review_comment || review.review_comment;
                review.ratings = body.ratings || review.ratings;

                const customer = await this.#dataSource.manager.findOneBy(Customer, {
                    customer_id: body.customer_id,
                });
                if (customer) {
                    review.customer = customer;
                } else {
                    return res.status(404).json({ error: 'Customer not found' });
                }

                const book = await this.#dataSource.manager.findOneBy(Book, {
                    book_id: body.book_id,
                });
                if (book) {
                    review.book = book;
                } else {
                    return res.status(404).json({ error: 'Book not found' });
                }

                try {
                    await this.#dataSource.manager.save(review);
                    console.log(`Review with id: ${review.review_id} has been updated`);
                    res.status(200).json({ message: 'Review updated successfully' });
                } catch (err) {
                    res.status(503).json({ error: 'Review update failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Review not found' });
            }
        });

        // Delete review data
        this.#express.delete('/review/:id', async (req, res) => {
            const review = await this.#dataSource.manager.findOneBy(Review, {
                review_id: parseInt(req.params.id),
            });

            if (review) {
                try {
                    console.log('Review found:', review); // Add this line to log the review object
                    await this.#dataSource.manager.remove(review);
                    console.log(`Review with id: ${review.review_id} has been deleted`);
                    res.status(200).json({ message: 'Review deleted successfully' });
                } catch (err) {
                    console.error('Error deleting review:', err); // Add this line to log the error
                    res.status(503).json({ error: 'Review deletion failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Review not found' });
            }
        });
    }
}
