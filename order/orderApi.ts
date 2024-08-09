import { Express } from 'express';
import { DataSource } from 'typeorm';
import { Order } from '../order/order';
import { Customer } from '../customer/customer';

export default class OrderApi {
    #dataSource: DataSource;
    #express: Express;

    constructor(dataSource: DataSource, express: Express) {
        this.#dataSource = dataSource;
        this.#express = express;
        this.setupRoutes();
    }

    setupRoutes() {
        this.#express.get('/order/:id', async (req, res) => {
            const order = await this.#dataSource.manager.findOneBy(Order, {
                order_id: parseInt(req.params.id),
            });
            if (order) {
                res.json(order);
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        });

        this.#express.post('/order', async (req, res) => {
            const { body } = req;
            console.log('Request body:', body);

            const order = new Order();
            order.order_date = body.order_date;
            order.bill_amount = body.bill_amount;

            const customer = await this.#dataSource.manager.findOneBy(Customer, {
                customer_id: body.customer_id,
            });
            if (customer) {
                order.customer = customer;
            } else {
                return res.status(404).json({ error: 'Customer not found' });
            }

            try {
                const savedOrder = await this.#dataSource.manager.save(order);
                console.log(`Order has been created with id: ${savedOrder.order_id}`);
                res.status(200).json({ id: savedOrder.order_id });
            } catch (err) {
                console.error('Error saving order:', err);
                res.status(503).json({ error: 'Order creation failed in db.' });
            }
        });

        // Update order data
        this.#express.put('/order/:id', async (req, res) => {
            const { body } = req;
            const order = await this.#dataSource.manager.findOneBy(Order, {
                order_id: parseInt(req.params.id),
            });

            if (order) {
                order.order_date = body.order_date || order.order_date;
                order.bill_amount = body.bill_amount || order.bill_amount;

                const customer = await this.#dataSource.manager.findOneBy(Customer, {
                    customer_id: body.customer_id,
                });
                if (customer) {
                    order.customer = customer;
                } else {
                    return res.status(404).json({ error: 'Customer not found' });
                }

                try {
                    await this.#dataSource.manager.save(order);
                    console.log(`Order with id: ${order.order_id} has been updated`);
                    res.status(200).json({ message: 'Order updated successfully' });
                } catch (err) {
                    res.status(503).json({ error: 'Order update failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        });

        // Delete order data
        this.#express.delete('/order/:id', async (req, res) => {
            const order = await this.#dataSource.manager.findOneBy(Order, {
                order_id: parseInt(req.params.id),
            });

            if (order) {
                try {
                    console.log('Order found:', order); // Add this line to log the order object
                    await this.#dataSource.manager.remove(order);
                    console.log(`Order with id: ${order.order_id} has been deleted`);
                    res.status(200).json({ message: 'Order deleted successfully' });
                } catch (err) {
                    console.error('Error deleting order:', err); // Add this line to log the error
                    res.status(503).json({ error: 'Order deletion failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        });
    }
}
