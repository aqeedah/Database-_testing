import FlatfilePersistence from './FlatfilePersistence';

// Create an instance of FlatfilePersistence
const persistenceService = new FlatfilePersistence();

// Create a new file
persistenceService.create('publishers');

// Insert a new publisher
persistenceService.insert({ 
  id: 1, 
  name: 'Best Publisher', 
  address: '123 Publisher St', 
  contactNumber: '123-456-7890' 
}, 'publishers');

// Update the publisher
persistenceService.update({ 
  id: 1, 
  name: 'Best Publisher', 
  address: '456 New Publisher Ave', 
  contactNumber: '987-654-3210' 
}, 'publishers');

// Delete the publisher
persistenceService.delete({ 
  id: 1, 
  name: 'Best Publisher', 
  address: '456 New Publisher Ave', 
  contactNumber: '987-654-3210' 
}, 'publishers');

// Drop the file
persistenceService.drop('publishers');
