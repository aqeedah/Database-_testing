import express, { Express } from 'express';
import { DataSource } from 'typeorm';
import request from 'supertest';
import ReviewApi from "./reviewApi";
import { postgresDataSource } from "../configure";

jest.setTimeout(20000); // Increase the timeout to 10 seconds

describe('Review Api', () => {
  let app: Express;
  let dataSource: DataSource;
  let reviewApi: ReviewApi;
  
  beforeAll(async () => {
    app = express();
    app.use(express.json()); // To parse JSON bodies
    dataSource = postgresDataSource;
    await dataSource.initialize(); // Ensure the data source is initialized
    reviewApi = new ReviewApi(dataSource, app);
  });

  afterAll(async () => {
    await dataSource.destroy(); // Clean up the data source
  });
  

  test('will return 404 if id is less than 0', async () => {
    const response = await request(app).get('/review/-1');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Review not found' });
  });

  test('a review is returned if a positive id is provided', async () => {
    // Mock the database response
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      content: 'a mocked review entity',
      rating: 5,
      book: {
        id: 1,
        title: 'Book Title',
      },
      customer: {
        id: 1,
        name: 'Customer Name',
      },
    });

    const response = await request(app).get('/review/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      content: 'a mocked review entity',
      rating: 5,
      book: {
        id: 1,
        title: 'Book Title',
      },
      customer: {
        id: 1,
        name: 'Customer Name',
      },
    });
  });

  test('creates a new review', async () => {
    // Mock the database save method
    const mockSave = jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      content: 'New Review',
      rating: 4,
      book: {
        id: 1,
        title: 'Book Title',
      },
      customer: {
        id: 1,
        name: 'Customer Name',
      },
    });

    const response = await request(app)
      .post('/review')
      .send({
        content: 'New Review',
        rating: 4,
        book: {
          id: 1,
          title: 'Book Title',
        },
        customer: {
          id: 1,
          name: 'Customer Name',
        },
      });

    console.log('Response body:', response.body); // Add this line to log the response body
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1 });

    // Ensure the mock was called with the correct data
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
      content: 'New Review',
      rating: 4,
      book: {
        id: 1,
        title: 'Book Title',
      },
      customer: {
        id: 1,
        name: 'Customer Name',
      },
    }));
  });

  test('updates an existing review', async () => {
    // Mock the database find and save methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      content: 'Existing Review',
      rating: 3,
      book: {
        id: 1,
        title: 'Book Title',
      },
      customer: {
        id: 1,
        name: 'Customer Name',
      },
    });
    jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      content: 'Updated Review',
      rating: 5,
      book: {
        id: 1,
        title: 'Book Title',
      },
      customer: {
        id: 1,
        name: 'Customer Name',
      },
    });

    const response = await request(app)
      .put('/review/1')
      .send({
        content: 'Updated Review',
        rating: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Review updated successfully' });
  });

  test('deletes a review', async () => {
    // Mock the database find and remove methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      content: 'Review to Delete',
      rating: 2,
      book: {
        id: 1,
        title: 'Book Title',
      },
      customer: {
        id: 1,
        name: 'Customer Name',
      },
    });
    jest.spyOn(dataSource.manager, 'remove').mockResolvedValue([{
      id: 1,
      content: 'Review to Delete',
      rating: 2,
      book: {
        id: 1,
        title: 'Book Title',
      },
      customer: {
        id: 1,
        name: 'Customer Name',
      },
    }]);

    const response = await request(app).delete('/review/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Review deleted successfully' });
  });
});
