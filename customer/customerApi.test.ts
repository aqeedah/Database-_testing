import express, { Express } from 'express';
import { DataSource } from 'typeorm';
import request from 'supertest';
import CustomerApi from "./customerApi";
import { postgresDataSource } from "../configure";

jest.setTimeout(20000); // Increase the timeout to 10 seconds

describe('Customer Api', () => {
  let app: Express;
  let dataSource: DataSource;
  let customerApi: CustomerApi;
  
  beforeAll(async () => {
    app = express();
    app.use(express.json()); // To parse JSON bodies
    dataSource = postgresDataSource;
    await dataSource.initialize(); // Ensure the data source is initialized
    customerApi = new CustomerApi(dataSource, app);
  });

  afterAll(async () => {
    await dataSource.destroy(); // Clean up the data source
  });
  

  test('will return 404 if id is less than 0', async () => {
    const response = await request(app).get('/customer/-1');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Customer not found' });
  });

  test('a customer is returned if a positive id is provided', async () => {
    // Mock the database response
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      name: 'a mocked customer entity',
      email: 'mocked@customer.entity',
      contactNumber: '123-456-7890',
    });

    const response = await request(app).get('/customer/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'a mocked customer entity',
      email: 'mocked@customer.entity',
      contactNumber: '123-456-7890',
    });
  });

  test('creates a new customer', async () => {
    // Mock the database save method
    const mockSave = jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      name: 'New Customer',
      email: 'new@customer.entity',
      contactNumber: '987-654-3210',
    });

    const response = await request(app)
      .post('/customer')
      .send({
        name: 'New Customer',
        email: 'new@customer.entity',
        contactNumber: '987-654-3210',
      });

    console.log('Response body:', response.body); // Add this line to log the response body
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1 });

    // Ensure the mock was called with the correct data
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Customer',
      email: 'new@customer.entity',
      contactNumber: '987-654-3210',
    }));
  });

  test('updates an existing customer', async () => {
    // Mock the database find and save methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      name: 'Existing Customer',
      email: 'existing@customer.entity',
      contactNumber: '123-456-7890',
    });
    jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      name: 'Updated Customer',
      email: 'updated@customer.entity',
      contactNumber: '123-456-7890',
    });

    const response = await request(app)
      .put('/customer/1')
      .send({
        name: 'Updated Customer',
        email: 'updated@customer.entity',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Customer updated successfully' });
  });

  test('deletes a customer', async () => {
    // Mock the database find and remove methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      name: 'Customer to Delete',
      email: 'delete@customer.entity',
      contactNumber: '123-456-7890',
    });
    jest.spyOn(dataSource.manager, 'remove').mockResolvedValue([{
      id: 1,
      name: 'Customer to Delete',
      email: 'delete@customer.entity',
      contactNumber: '123-456-7890',
    }]);

    const response = await request(app).delete('/customer/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Customer deleted successfully' });
  });
});
