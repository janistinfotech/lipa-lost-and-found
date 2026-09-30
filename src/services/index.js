/**
 * Services Module
 * Exports initialized Firebase services and item CRUD service functions.
 */

export { app, auth, db } from './firebase';
export { 
  createItemReport, 
  getItems, 
  getFilteredItems,
  getItemById, 
  getItemsByUser,
  updateItemReport,
  markItemResolved,
  deleteItemReport,
  getFriendlyFirestoreErrorMessage 
} from './itemService';
