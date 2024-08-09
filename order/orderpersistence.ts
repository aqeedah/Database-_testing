import FlatfilePersistence from './FlatfilePersistence';

// Create an instance of FlatfilePersistence
const persistenceService = new FlatfilePersistence();

// Create a new file
persistenceService.create('orders');

// Insert a new order
persistenceService.insert({ 
  id: 1, 
  orderDate: '2023-01-01', 
  customerId: 1, 
  totalAmount: 99.99 
}, 'orders');

// Update the order
persistenceService.update({ 
  id: 1, 
  orderDate: '2023-01-01', 
  customerId: 1, 
  totalAmount: 199.99 
}, 'orders');

// Delete the order
persistenceService.delete({ 
  id: 1, 
  orderDate: '2023-01-01', 
  customerId: 1, 
  totalAmount: 199.99 
}, 'orders');

// Drop the file
persistenceService.drop('orders');
