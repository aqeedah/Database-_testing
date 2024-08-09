import express, { Express } from 'express';
import { DataSource } from 'typeorm';
import request from 'supertest';
import AuthorApi from "./authorApi";
import { postgresDataSource } from "../configure";

jest.setTimeout(20000); // Increase the timeout to 10 seconds

describe('Author Api', () => {
  let app: Express;
  let dataSource: DataSource;
  let authorApi: AuthorApi;
  
  beforeAll(async () => {
    app = express();
    app.use(express.json()); // To parse JSON bodies
    dataSource = postgresDataSource;
    await dataSource.initialize(); // Ensure the data source is initialized
    authorApi = new AuthorApi(dataSource, app);
  });

  afterAll(async () => {
    await dataSource.destroy(); // Clean up the data source
  });
  

  test('will return 404 if id is less than 0', async () => {
    const response = await request(app).get('/author/-1');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Author not found' });
  });

  test('an author is returned if a positive id is provided', async () => {
    // Mock the database response
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      name: 'a mocked author entity',
      email: 'mocked@author.entity',
      contactNumber: '123-456-7890',
    });

    const response = await request(app).get('/author/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'a mocked author entity',
      email: 'mocked@author.entity',
      contactNumber: '123-456-7890',
    });
  });

  test('creates a new author', async () => {
    // Mock the database save method
    const mockSave = jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      name: 'New Author',
      email: 'new@author.entity',
      contactNumber: '987-654-3210',
    });

    const response = await request(app)
      .post('/author')
      .send({
        name: 'New Author',
        email: 'new@author.entity',
        contactNumber: '987-654-3210',
      });

    console.log('Response body:', response.body); // Add this line to log the response body
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1 });

    // Ensure the mock was called with the correct data
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Author',
      email: 'new@author.entity',
      contactNumber: '987-654-3210',
    }));
  });

  test('updates an existing author', async () => {
    // Mock the database find and save methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      name: 'Existing Author',
      email: 'existing@author.entity',
      contactNumber: '123-456-7890',
    });
    jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      name: 'Updated Author',
      email: 'updated@author.entity',
      contactNumber: '123-456-7890',
    });

    const response = await request(app)
      .put('/author/1')
      .send({
        name: 'Updated Author',
        email: 'updated@author.entity',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Author updated successfully' });
  });

  test('deletes an author', async () => {
    // Mock the database find and remove methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      name: 'Author to Delete',
      email: 'delete@author.entity',
      contactNumber: '123-456-7890',
    });
    jest.spyOn(dataSource.manager, 'remove').mockResolvedValue([{
      id: 1,
      name: 'Author to Delete',
      email: 'delete@author.entity',
      contactNumber: '123-456-7890',
    }]);

    const response = await request(app).delete('/author/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Author deleted successfully' });
  });
});
