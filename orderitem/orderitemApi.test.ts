import express, { Express } from 'express';
import { DataSource } from 'typeorm';
import request from 'supertest';
import OrderItemApi from "./orderitemApi";
import { postgresDataSource } from "../configure";

jest.setTimeout(20000); // Increase the timeout to 10 seconds

describe('OrderItem Api', () => {
  let app: Express;
  let dataSource: DataSource;
  let orderItemApi: OrderItemApi;
  
  beforeAll(async () => {
    app = express();
    app.use(express.json()); // To parse JSON bodies
    dataSource = postgresDataSource;
    await dataSource.initialize(); // Ensure the data source is initialized
    orderItemApi = new OrderItemApi(dataSource, app);
  });

  afterAll(async () => {
    await dataSource.destroy(); // Clean up the data source
  });
  

  test('will return 404 if id is less than 0', async () => {
    const response = await request(app).get('/order_item/-1');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'OrderItem not found' });
  });

  test('an order item is returned if a positive id is provided', async () => {
    // Mock the database response
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      order: {
        id: 1,
        orderDate: '2023-01-01',
      },
      book: {
        id: 1,
        title: 'Book Title',
      },
      quantity: 2,
      price: 19.99,
    });

    const response = await request(app).get('/order_item/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      order: {
        id: 1,
        orderDate: '2023-01-01',
      },
      book: {
        id: 1,
        title: 'Book Title',
      },
      quantity: 2,
      price: 19.99,
    });
  });

  test('creates a new order item', async () => {
    // Mock the database save method
    const mockSave = jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      order: {
        id: 1,
        orderDate: '2023-01-01',
      },
      book: {
        id: 1,
        title: 'Book Title',
      },
      quantity: 2,
      price: 19.99,
    });

    const response = await request(app)
      .post('/order_item')
      .send({
        order_id: 1,
        book_id: 1,
        quantity: 2,
        price: 19.99,
      });

    console.log('Response body:', response.body); // Add this line to log the response body
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1 });

    // Ensure the mock was called with the correct data
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
      order: {
        id: 1,
        orderDate: '2023-01-01',
      },
      book: {
        id: 1,
        title: 'Book Title',
      },
      quantity: 2,
      price: 19.99,
    }));
  });

  test('updates an existing order item', async () => {
    // Mock the database find and save methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      order: {
        id: 1,
        orderDate: '2023-01-01',
      },
      book: {
        id: 1,
        title: 'Book Title',
      },
      quantity: 2,
      price: 19.99,
    });
    jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      order: {
        id: 1,
        orderDate: '2023-01-01',
      },
      book: {
        id: 1,
        title: 'Book Title',
      },
      quantity: 3,
      price: 29.99,
    });

    const response = await request(app)
      .put('/order_item/1')
      .send({
        quantity: 3,
        price: 29.99,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'OrderItem updated successfully' });
  });

  test('deletes an order item', async () => {
    // Mock the database find and remove methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      order: {
        id: 1,
        orderDate: '2023-01-01',
      },
      book: {
        id: 1,
        title: 'Book Title',
      },
      quantity: 2,
      price: 19.99,
    });
    jest.spyOn(dataSource.manager, 'remove').mockResolvedValue([{
      id: 1,
      order: {
        id: 1,
        orderDate: '2023-01-01',
      },
      book: {
        id: 1,
        title: 'Book Title',
      },
      quantity: 2,
      price: 19.99,
    }]);

    const response = await request(app).delete('/order_item/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'OrderItem deleted successfully' });
  });
});
