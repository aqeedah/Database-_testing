import FlatfilePersistence from './FlatfilePersistence';

// Create an instance of FlatfilePersistence
const persistenceService = new FlatfilePersistence();

// Create a new file
persistenceService.create('reviews');

// Insert a new review
persistenceService.insert({ 
  id: 1, 
  content: 'Great book!', 
  rating: 5, 
  bookId: 1, 
  customerId: 1 
}, 'reviews');

// Update the review
persistenceService.update({ 
  id: 1, 
  content: 'Amazing book!', 
  rating: 5, 
  bookId: 1, 
  customerId: 1 
}, 'reviews');

// Delete the review
persistenceService.delete({ 
  id: 1, 
  content: 'Amazing book!', 
  rating: 5, 
  bookId: 1, 
  customerId: 1 
}, 'reviews');

// Drop the file
persistenceService.drop('reviews');
