import { Express } from 'express';
import { DataSource } from 'typeorm';
import { Customer } from '../customer/customer';

export default class CustomerApi {
    #dataSource: DataSource;
    #express: Express;

    constructor(dataSource: DataSource, express: Express) {
        this.#dataSource = dataSource;
        this.#express = express;
        this.setupRoutes();
    }

    setupRoutes() {
        this.#express.get('/customer/:id', async (req, res) => {
            const customer = await this.#dataSource.manager.findOneBy(Customer, {
                customer_id: parseInt(req.params.id),
            });
            if (customer) {
                res.json(customer);
            } else {
                res.status(404).json({ error: 'Customer not found' });
            }
        });

        this.#express.post('/customer', async (req, res) => {
            const { body } = req;
            console.log('Request body:', body);

            const customer = new Customer();
            customer.first_name = body.first_name;
            customer.last_name = body.last_name;
            customer.contact_number = body.contact_number;
            customer.address = body.address;
            customer.total_spent_amount = body.total_spent_amount;
            customer.registration_date = body.registration_date;

            try {
                const savedCustomer = await this.#dataSource.manager.save(customer);
                console.log(`Customer has been created with id: ${savedCustomer.customer_id}`);
                res.status(200).json({ id: savedCustomer.customer_id });
            } catch (err) {
                console.error('Error saving customer:', err);
                res.status(503).json({ error: 'Customer creation failed in db.' });
            }
        });

        // Update customer data
        this.#express.put('/customer/:id', async (req, res) => {
            const { body } = req;
            const customer = await this.#dataSource.manager.findOneBy(Customer, {
                customer_id: parseInt(req.params.id),
            });

            if (customer) {
                customer.first_name = body.first_name || customer.first_name;
                customer.last_name = body.last_name || customer.last_name;
                customer.contact_number = body.contact_number || customer.contact_number;
                customer.address = body.address || customer.address;
                customer.total_spent_amount = body.total_spent_amount || customer.total_spent_amount;
                customer.registration_date = body.registration_date || customer.registration_date;

                try {
                    await this.#dataSource.manager.save(customer);
                    console.log(`Customer with id: ${customer.customer_id} has been updated`);
                    res.status(200).json({ message: 'Customer updated successfully' });
                } catch (err) {
                    res.status(503).json({ error: 'Customer update failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Customer not found' });
            }
        });

        // Delete customer data
        this.#express.delete('/customer/:id', async (req, res) => {
            const customer = await this.#dataSource.manager.findOneBy(Customer, {
                customer_id: parseInt(req.params.id),
            });

            if (customer) {
                try {
                    console.log('Customer found:', customer); // Add this line to log the customer object
                    await this.#dataSource.manager.remove(customer);
                    console.log(`Customer with id: ${customer.customer_id} has been deleted`);
                    res.status(200).json({ message: 'Customer deleted successfully' });
                } catch (err) {
                    console.error('Error deleting customer:', err); // Add this line to log the error
                    res.status(503).json({ error: 'Customer deletion failed in db.' });
                }
            } else {
                res.status(404).json({ error: 'Customer not found' });
            }
        });
    }
}
