import { Express } from 'express';
import { DataSource } from 'typeorm';
import { OrderItem } from '../orderitem/orderitem';
import { Order } from '../order/order';
import { Book } from '../book/book';

export default class OrderItemApi {
    #dataSource: DataSource;
    #express: Express;

    constructor(dataSource: DataSource, express: Express) {
        this.#dataSource = dataSource;
        this.#express = express;
        this.setupRoutes();
    }

    setupRoutes() {
        this.#express.get('/order_item/:id', async (req, res) => {
            const orderItem = await this.#dataSource.manager.findOneBy(OrderItem, {
                order_item_id: parseInt(req.params.id),
            });
            if (orderItem) {
                res.json(orderItem);
            } else {
                res.status(404).json({ error: 'OrderItem not found' });
            }
        });

        this.#express.post('/order_item', async (req, res) => {
            const { body } = req;
            console.log('Request body:', body);

            const orderItem = new OrderItem();
            orderItem.quantity = body.quantity;
            orderItem.price = body.price;

            const order = await this.#dataSource.manager.findOneBy(Order, {
                order_id: body.order_id,
            });
            if (order) {
                orderItem.order = order;
            } else {
                return res.status(404).json({ error: 'Order not found' });
            }

            const book = await this.#dataSource.manager.findOneBy(Book, {
                book_id: body.book_id,
            });
            if (book) {
                orderItem.book = book;
            } else {
                return res.status(404).json({ error: 'Book not found' });
            }

            try {
                const savedOrderItem = await this.#dataSource.manager.save(orderItem);
                console.log(`OrderItem has been created with id: ${savedOrderItem.order_item_id}`);
                res.status(200).json({ id: savedOrderItem.order_item_id });
            } catch (err) {
                console.error('Error saving orderItem:', err);
                res.status(503).json({ error: 'OrderItem creation failed in db.' });
            }
        });

        // Update orderItem data
        this.#express.put('/order_item/:id', async (req, res) => {
            const { body } = req;
            const orderItem = await this.#dataSource.manager.findOneBy(OrderItem, {
                order_item_id: parseInt(req.params.id),
            });

            if (orderItem) {
                orderItem.quantity = body.quantity || orderItem.quantity;
                orderItem.price = body.price || orderItem.price;

                const order = await this.#dataSource.manager.findOneBy(Order, {
                    order_id: body.order_id,
                });
                if (order) {
                    orderItem.order = order;
                } else {
                    return res.status(404).json({ error: 'Order not found' });
                }

                const book = await this.#dataSource.manager.findOneBy(Book, {
                    book_id: body.book_id,
                });
                if (book) {
                    orderItem.book = book;
                } else {
                    return res.status(404).json({ error: 'Book not found' });
                }

                try {
                    await this.#dataSource.manager.save(orderItem);
                    console.log(`OrderItem with id: ${orderItem.order_item_id} has been updated`);
                    res.status(200).json({ message: 'OrderItem updated successfully' });
                } catch (err) {
                    res.status(503).json({ error: 'OrderItem update failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'OrderItem not found' });
            }
        });

        // Delete orderItem data
        this.#express.delete('/order_item/:id', async (req, res) => {
            const orderItem = await this.#dataSource.manager.findOneBy(OrderItem, {
                order_item_id: parseInt(req.params.id),
            });

            if (orderItem) {
                try {
                    console.log('OrderItem found:', orderItem); // Add this line to log the orderItem object
                    await this.#dataSource.manager.remove(orderItem);
                    console.log(`OrderItem with id: ${orderItem.order_item_id} has been deleted`);
                    res.status(200).json({ message: 'OrderItem deleted successfully' });
                } catch (err) {
                    console.error('Error deleting orderItem:', err); // Add this line to log the error
                    res.status(503).json({ error: 'OrderItem deletion failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'OrderItem not found' });
            }
        });
    }
}
