import FlatfilePersistence from './FlatfilePersistence';

// Create an instance of FlatfilePersistence
const persistenceService = new FlatfilePersistence();

// Create a new file
persistenceService.create('orderitems');

// Insert a new order item
persistenceService.insert({ 
  id: 1, 
  orderId: 1, 
  bookId: 1, 
  quantity: 2, 
  price: 19.99 
}, 'orderitems');

// Update the order item
persistenceService.update({ 
  id: 1, 
  orderId: 1, 
  bookId: 1, 
  quantity: 3, 
  price: 29.99 
}, 'orderitems');

// Delete the order item
persistenceService.delete({ 
  id: 1, 
  orderId: 1, 
  bookId: 1, 
  quantity: 3, 
  price: 29.99 
}, 'orderitems');

// Drop the file
persistenceService.drop('orderitems');
