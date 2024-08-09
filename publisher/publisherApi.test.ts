import express, { Express } from 'express';
import { DataSource } from 'typeorm';
import request from 'supertest';
import PublisherApi from "./publisherApi";
import { postgresDataSource } from "../configure";

jest.setTimeout(20000); // Increase the timeout to 10 seconds

describe('Publisher Api', () => {
  let app: Express;
  let dataSource: DataSource;
  let publisherApi: PublisherApi;
  
  beforeAll(async () => {
    app = express();
    app.use(express.json()); // To parse JSON bodies
    dataSource = postgresDataSource;
    await dataSource.initialize(); // Ensure the data source is initialized
    publisherApi = new PublisherApi(dataSource, app);
  });

  afterAll(async () => {
    await dataSource.destroy(); // Clean up the data source
  });
  

  test('will return 404 if id is less than 0', async () => {
    const response = await request(app).get('/publisher/-1');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Publisher not found' });
  });

  test('a publisher is returned if a positive id is provided', async () => {
    // Mock the database response
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      name: 'a mocked publisher entity',
      address: '123 Publisher St',
      contactNumber: '123-456-7890',
    });

    const response = await request(app).get('/publisher/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'a mocked publisher entity',
      address: '123 Publisher St',
      contactNumber: '123-456-7890',
    });
  });

  test('creates a new publisher', async () => {
    // Mock the database save method
    const mockSave = jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      name: 'New Publisher',
      address: '456 New Publisher Ave',
      contactNumber: '987-654-3210',
    });

    const response = await request(app)
      .post('/publisher')
      .send({
        name: 'New Publisher',
        address: '456 New Publisher Ave',
        contactNumber: '987-654-3210',
      });

    console.log('Response body:', response.body); // Add this line to log the response body
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1 });

    // Ensure the mock was called with the correct data
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Publisher',
      address: '456 New Publisher Ave',
      contactNumber: '987-654-3210',
    }));
  });

  test('updates an existing publisher', async () => {
    // Mock the database find and save methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      name: 'Existing Publisher',
      address: '123 Publisher St',
      contactNumber: '123-456-7890',
    });
    jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      name: 'Updated Publisher',
      address: '789 Updated Publisher Blvd',
      contactNumber: '123-456-7890',
    });

    const response = await request(app)
      .put('/publisher/1')
      .send({
        name: 'Updated Publisher',
        address: '789 Updated Publisher Blvd',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Publisher updated successfully' });
  });

  test('deletes a publisher', async () => {
    // Mock the database find and remove methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      name: 'Publisher to Delete',
      address: '123 Publisher St',
      contactNumber: '123-456-7890',
    });
    jest.spyOn(dataSource.manager, 'remove').mockResolvedValue([{
      id: 1,
      name: 'Publisher to Delete',
      address: '123 Publisher St',
      contactNumber: '123-456-7890',
    }]);

    const response = await request(app).delete('/publisher/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Publisher deleted successfully' });
  });
});
