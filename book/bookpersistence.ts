import FlatfilePersistence from './FlatfilePersistence';

// Create an instance of FlatfilePersistence
const persistenceService = new FlatfilePersistence();

// Create a new file
persistenceService.create('books');

// Insert a new book
persistenceService.insert({ 
  id: 1, 
  title: 'The Great Book', 
  genre: 'Fiction', 
  type: 'Hardcover', 
  publicationDate: '2023-01-01', 
  price: 19.99, 
  authorId: 1, 
  publisherId: 1, 
  isbn: '123-456-7890' 
}, 'books');

// Update the book
persistenceService.update({ 
  id: 1, 
  title: 'The Great Book', 
  genre: 'Fiction', 
  type: 'Hardcover', 
  publicationDate: '2023-01-01', 
  price: 19.99, 
  authorId: 1, 
  publisherId: 1, 
  isbn: '987-654-3210' 
}, 'books');

// Delete the book
persistenceService.delete({ 
  id: 1, 
  title: 'The Great Book', 
  genre: 'Fiction', 
  type: 'Hardcover', 
  publicationDate: '2023-01-01', 
  price: 19.99, 
  authorId: 1, 
  publisherId: 1, 
  isbn: '987-654-3210' 
}, 'books');

// Drop the file
persistenceService.drop('books');
