import express, { Express } from 'express';
import { DataSource } from 'typeorm';
import request from 'supertest';
import BookApi from "./bookApi";
import { postgresDataSource } from "../configure";

jest.setTimeout(20000); // Increase the timeout to 10 seconds

describe('Book Api', () => {
  let app: Express;
  let dataSource: DataSource;
  let bookApi: BookApi;
  
  beforeAll(async () => {
    app = express();
    app.use(express.json()); // To parse JSON bodies
    dataSource = postgresDataSource;
    await dataSource.initialize(); // Ensure the data source is initialized
    bookApi = new BookApi(dataSource, app);
  });

  afterAll(async () => {
    await dataSource.destroy(); // Clean up the data source
  });
  

  test('will return 404 if id is less than 0', async () => {
    const response = await request(app).get('/book/-1');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Book not found' });
  });

  test('a book is returned if a positive id is provided', async () => {
    // Mock the database response
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      title: 'a mocked book entity',
      genre: 'Fiction',
      type: 'Hardcover',
      publicationDate: '2023-01-01',
      price: 19.99,
      author: {
        id: 1,
        name: 'Author Name',
      },
      publisher: {
        id: 1,
        name: 'Publisher Name',
      },
      isbn: '123-456-7890',
    });

    const response = await request(app).get('/book/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      title: 'a mocked book entity',
      genre: 'Fiction',
      type: 'Hardcover',
      publicationDate: '2023-01-01',
      price: 19.99,
      author: {
        id: 1,
        name: 'Author Name',
      },
      publisher: {
        id: 1,
        name: 'Publisher Name',
      },
      isbn: '123-456-7890',
    });
  });

  test('creates a new book', async () => {
    // Mock the database save method
    const mockSave = jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      title: 'New Book',
      genre: 'Non-Fiction',
      type: 'Paperback',
      publicationDate: '2023-01-01',
      price: 9.99,
      author: {
        id: 1,
        name: 'Author Name',
      },
      publisher: {
        id: 1,
        name: 'Publisher Name',
      },
      isbn: '987-654-3210',
    });

    const response = await request(app)
      .post('/book')
      .send({
        title: 'New Book',
        genre: 'Non-Fiction',
        type: 'Paperback',
        publicationDate: '2023-01-01',
        price: 9.99,
        author: {
          id: 1,
          name: 'Author Name',
        },
        publisher: {
          id: 1,
          name: 'Publisher Name',
        },
        isbn: '987-654-3210',
      });

    console.log('Response body:', response.body); // Add this line to log the response body
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1 });

    // Ensure the mock was called with the correct data
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Book',
      genre: 'Non-Fiction',
      type: 'Paperback',
      publicationDate: '2023-01-01',
      price: 9.99,
      author: {
        id: 1,
        name: 'Author Name',
      },
      publisher: {
        id: 1,
        name: 'Publisher Name',
      },
      isbn: '987-654-3210',
    }));
  });

  test('updates an existing book', async () => {
    // Mock the database find and save methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      title: 'Existing Book',
      genre: 'Fiction',
      type: 'Hardcover',
      publicationDate: '2023-01-01',
      price: 19.99,
      author: {
        id: 1,
        name: 'Author Name',
      },
      publisher: {
        id: 1,
        name: 'Publisher Name',
      },
      isbn: '123-456-7890',
    });
    jest.spyOn(dataSource.manager, 'save').mockResolvedValue({
      id: 1,
      title: 'Updated Book',
      genre: 'Non-Fiction',
      type: 'Paperback',
      publicationDate: '2023-01-01',
      price: 9.99,
      author: {
        id: 1,
        name: 'Author Name',
      },
      publisher: {
        id: 1,
        name: 'Publisher Name',
      },
      isbn: '987-654-3210',
    });

    const response = await request(app)
      .put('/book/1')
      .send({
        title: 'Updated Book',
        genre: 'Non-Fiction',
        type: 'Paperback',
        publicationDate: '2023-01-01',
        price: 9.99,
        author: {
          id: 1,
          name: 'Author Name',
        },
        publisher: {
          id: 1,
          name: 'Publisher Name',
        },
        isbn: '987-654-3210',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Book updated successfully' });
  });

  test('deletes a book', async () => {
    // Mock the database find and remove methods
    jest.spyOn(dataSource.manager, 'findOneBy').mockResolvedValue({
      id: 1,
      title: 'Book to Delete',
      genre: 'Fiction',
      type: 'Hardcover',
      publicationDate: '2023-01-01',
      price: 19.99,
      author: {
        id: 1,
        name: 'Author Name',
      },
      publisher: {
        id: 1,
        name: 'Publisher Name',
      },
      isbn: '123-456-7890',
    });
    jest.spyOn(dataSource.manager, 'remove').mockResolvedValue([{
      id: 1,
      title: 'Book to Delete',
      genre: 'Fiction',
      type: 'Hardcover',
      publicationDate: '2023-01-01',
      price: 19.99,
      author: {
        id: 1,
        name: 'Author Name',
      },
      publisher: {
        id: 1,
        name: 'Publisher Name',
      },
      isbn: '123-456-7890',
    }]);

    const response = await request(app).delete('/book/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Book deleted successfully' });
  });
});
