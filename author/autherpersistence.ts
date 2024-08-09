import FlatfilePersistence from './FlatfilePersistence';

// Create an instance of FlatfilePersistence
const persistenceService = new FlatfilePersistence();

// Create a new file
persistenceService.create('authors');

// Insert a new author
persistenceService.insert({ id: 1, name: 'Akida', email: 'Akida@example.com', contactNumber: '123-456-7890' }, 'authors');

// Update the author
persistenceService.update({ id: 1, name: 'Jani', email: 'jani@example.com', contactNumber: '987-654-3210' }, 'authors');

// Delete the author
persistenceService.delete({ id: 1, name: 'Jani', email: 'jani@example.com', contactNumber: '987-654-3210' }, 'authors');

// Drop the file
persistenceService.drop('authors');
