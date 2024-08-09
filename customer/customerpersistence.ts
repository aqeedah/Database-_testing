import FlatfilePersistence from './FlatfilePersistence';

// Create an instance of FlatfilePersistence
const persistenceService = new FlatfilePersistence();

// Create a new file
persistenceService.create('customers');

// Insert a new customer
persistenceService.insert({ 
  id: 1, 
  name: 'Alice Smith', 
  email: 'alice.smith@example.com', 
  contactNumber: '123-456-7890' 
}, 'customers');

// Update the customer
persistenceService.update({ 
  id: 1, 
  name: 'Alice Smith', 
  email: 'alice.smith@example.com', 
  contactNumber: '987-654-3210' 
}, 'customers');

// Delete the customer
persistenceService.delete({ 
  id: 1, 
  name: 'Alice Smith', 
  email: 'alice.smith@example.com', 
  contactNumber: '987-654-3210' 
}, 'customers');

// Drop the file
persistenceService.drop('customers');
