import express, { Express } from 'express';
import { DataSource } from 'typeorm';
import request from 'supertest';
import OrderApi from "./orderApi";
import { postgresDataSource } from "../configure";

jest.setTimeout(20000); // Increase the timeout to 10 seconds

describe('Order Api', () => {
  let app: Express;
  let dataSource: DataSource;
  let orderApi: OrderApi;
  
  beforeAll(async () => {
    app = express();
    app.use(express.json()); // To parse JSON bodies
    dataSource = postgresDataSource;
    await dataSource.initialize(); // Ensure the data source is initialized
    orderApi = new OrderApi(dataSource, app);
  });

  afterAll(async () => {
    await dataSource.destroy(); // Clean up the data source
  });
  

  test('will return 404 if id is less than 0', async () => {
    const response = await request(app).get('/order/-1');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Order not found' });
  });

  test('an order is returned if a positive id is provided', async () => {
    // Mock the database response
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      orderDate: '2023-01-01',
      customer: {
        id: 1,
        name: 'Customer Name',
      },
      totalAmount: 99.99,
    });

    const response = await request(app).get('/order/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      orderDate: '2023-01-01',
      customer: {
        id: 1,
        name: 'Customer Name',
      },
      totalAmount: 99.99,
    });
  });

  test('creates a new order', async () => {
    // Mock the database save method
    const mockSave = jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      orderDate: '2023-01-01',
      customer: {
        id: 1,
        name: 'Customer Name',
      },
      totalAmount: 99.99,
    });

    const response = await request(app)
      .post('/order')
      .send({
        orderDate: '2023-01-01',
        customer: {
          id: 1,
          name: 'Customer Name',
        },
        totalAmount: 99.99,
      });

    console.log('Response body:', response.body); // Add this line to log the response body
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1 });

    // Ensure the mock was called with the correct data
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
      orderDate: '2023-01-01',
      customer: {
        id: 1,
        name: 'Customer Name',
      },
      totalAmount: 99.99,
    }));
  });

  test('updates an existing order', async () => {
    // Mock the database find and save methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      orderDate: '2023-01-01',
      customer: {
        id: 1,
        name: 'Customer Name',
      },
      totalAmount: 99.99,
    });
    jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      orderDate: '2023-01-01',
      customer: {
        id: 1,
        name: 'Customer Name',
      },
      totalAmount: 199.99,
    });

    const response = await request(app)
      .put('/order/1')
      .send({
        totalAmount: 199.99,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Order updated successfully' });
  });

  test('deletes an order', async () => {
    // Mock the database find and remove methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      orderDate: '2023-01-01',
      customer: {
        id: 1,
        name: 'Customer Name',
      },
      totalAmount: 99.99,
    });
    jest.spyOn(dataSource.manager, 'remove').mockResolvedValue([{
      id: 1,
      orderDate: '2023-01-01',
      customer: {
        id: 1,
        name: 'Customer Name',
      },
      totalAmount: 99.99,
    }]);

    const response = await request(app).delete('/order/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Order deleted successfully' });
  });
});
