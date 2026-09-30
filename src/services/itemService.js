import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where,
  orderBy, 
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Creates a new lost or found item report in Firestore.
 * 
 * @param {Object} itemPayload
 * @returns {Promise<Object>} Created document reference
 */
export const createItemReport = async ({
  userId,
  posterName,
  type,
  itemName,
  category,
  barangay,
  location,
  eventDate,
  description,
  contactInfo
}) => {
  const itemDoc = {
    userId,
    posterName: posterName || 'Resident',
    type,
    itemName: itemName.trim(),
    category,
    barangay,
    location: location.trim(),
    eventDate,
    description: description.trim(),
    contactInfo: contactInfo ? contactInfo.trim() : '',
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'items'), itemDoc);
  return { id: docRef.id, ...itemDoc };
};

/**
 * Fetches all item reports from Firestore ordered by newest first.
 * 
 * @returns {Promise<Array>} List of item objects with document IDs
 */
export const getItems = async () => {
  try {
    const itemsCollection = collection(db, 'items');
    const q = query(itemsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    return items;
  } catch (err) {
    if (err.code === 'failed-precondition' || err.message?.includes('index')) {
      console.warn('[getItems] Retrying query without orderBy constraint...', err);
      const itemsCollection = collection(db, 'items');
      const snapshot = await getDocs(itemsCollection);
      const items = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      return items.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
    }
    throw err;
  }
};

/**
 * Executes a structured Firestore query with dynamic where() constraints.
 * Demonstrates modular Firestore query building for Type, Category, Barangay, and Status.
 * 
 * @param {Object} filters - { type, category, barangay, status }
 * @returns {Promise<Array>} Filtered item list sorted newest first
 */
export const getFilteredItems = async ({
  type = 'all',
  category = 'all',
  barangay = 'all',
  status = 'all'
} = {}) => {
  try {
    const constraints = [];

    // 1. Dynamic Firestore where() constraint for Report Type
    if (type && type !== 'all') {
      constraints.push(where('type', '==', type));
    }

    // 2. Dynamic Firestore where() constraint for Category
    if (category && category !== 'all') {
      constraints.push(where('category', '==', category));
    }

    // 3. Dynamic Firestore where() constraint for Barangay
    if (barangay && barangay !== 'all') {
      constraints.push(where('barangay', '==', barangay));
    }

    // 4. Dynamic Firestore where() constraint for Status
    if (status && status !== 'all') {
      constraints.push(where('status', '==', status));
    }

    const itemsCollection = collection(db, 'items');

    // Build query with dynamically composed constraints
    const q = constraints.length > 0 
      ? query(itemsCollection, ...constraints)
      : query(itemsCollection);

    const snapshot = await getDocs(q);

    const items = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    // Client-side sort by newest first to ensure reliability across all where() filter combinations
    return items.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

  } catch (err) {
    console.error('[getFilteredItems Error]:', err);
    throw err;
  }
};

/**
 * Fetches a single item report by document ID.
 * 
 * @param {string} itemId
 * @returns {Promise<Object|null>} Item object or null if not found
 */
export const getItemById = async (itemId) => {
  if (!itemId) return null;
  const docRef = doc(db, 'items', itemId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data()
  };
};

/**
 * Fetches all item reports created by a specific user.
 * 
 * @param {string} userId - The Firebase Auth UID
 * @returns {Promise<Array>} List of user-owned item reports
 */
export const getItemsByUser = async (userId) => {
  if (!userId) return [];

  try {
    const itemsCollection = collection(db, 'items');
    const q = query(itemsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const userItems = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    return userItems.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (err) {
    console.error('[getItemsByUser Error]:', err);
    throw err;
  }
};

/**
 * Updates editable fields of an existing item report.
 * 
 * @param {string} itemId - The Firestore document ID
 * @param {Object} updates - The allowed fields to update
 * @returns {Promise<void>}
 */
export const updateItemReport = async (itemId, {
  itemName,
  category,
  barangay,
  location,
  eventDate,
  description,
  contactInfo
}) => {
  if (!itemId) throw new Error('Item ID is required for updates.');

  const docRef = doc(db, 'items', itemId);
  const sanitizedUpdates = {
    itemName: itemName.trim(),
    category,
    barangay,
    location: location.trim(),
    eventDate,
    description: description.trim(),
    contactInfo: contactInfo ? contactInfo.trim() : '',
    updatedAt: serverTimestamp()
  };

  await updateDoc(docRef, sanitizedUpdates);
};

/**
 * Marks an active item report as resolved (recovered/returned).
 * 
 * @param {string} itemId - The Firestore document ID
 * @returns {Promise<void>}
 */
export const markItemResolved = async (itemId) => {
  if (!itemId) throw new Error('Item ID is required to mark as resolved.');

  const docRef = doc(db, 'items', itemId);
  await updateDoc(docRef, {
    status: 'resolved',
    updatedAt: serverTimestamp()
  });
};

/**
 * Deletes a user-owned item report permanently from Firestore after verifying ownership.
 * 
 * @param {string} itemId - The Firestore document ID to delete
 * @param {string} userId - The authenticated user's UID
 * @returns {Promise<void>}
 */
export const deleteItemReport = async (itemId, userId) => {
  if (!itemId) throw new Error('Item ID is required for deletion.');
  if (!userId) {
    const error = new Error('Authentication required.');
    error.code = 'permission-denied';
    throw error;
  }

  const docRef = doc(db, 'items', itemId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const error = new Error('Report not found.');
    error.code = 'not-found';
    throw error;
  }

  const data = docSnap.data();
  if (data.userId !== userId) {
    const error = new Error('Permission denied.');
    error.code = 'permission-denied';
    throw error;
  }

  await deleteDoc(docRef);
};

/**
 * Translates Firestore error codes to friendly strings for reporting.
 */
export const getFriendlyFirestoreErrorMessage = (error, action = 'load') => {
  if (!error) {
    return action === 'post' 
      ? 'Unable to post your item right now. Please try again.'
      : action === 'update'
      ? 'Unable to update the report right now. Please try again.'
      : action === 'delete'
      ? 'Unable to delete the report right now. Please try again.'
      : action === 'query'
      ? 'Something went wrong while filtering the directory.'
      : 'Something went wrong while loading reports.';
  }

  const code = error.code || '';
  const message = error.message || '';

  if (code.includes('permission-denied')) {
    if (action === 'delete') return 'You do not have permission to delete this report.';
    if (action === 'update') return 'You do not have permission to update this report.';
    if (action === 'post') return 'You do not have permission to post this item.';
    return 'You do not have permission to view these reports.';
  }

  if (code.includes('failed-precondition') || message.includes('index')) {
    return 'A Firestore index is required for this filter combination.';
  }

  if (code.includes('not-found') || message.includes('not-found')) {
    return 'This report no longer exists.';
  }

  if (code.includes('unavailable') || code.includes('network') || message.toLowerCase().includes('network')) {
    if (action === 'delete') return 'Unable to delete the report right now. Check your connection and try again.';
    if (action === 'update') return 'Unable to update the report right now. Check your connection and try again.';
    if (action === 'query') return 'Unable to load filtered reports right now. Check your connection and try again.';
    return 'Unable to connect. Check your internet connection and try again.';
  }

  if (action === 'delete') return 'Something went wrong while deleting the report.';
  if (action === 'update') return 'Something went wrong while updating your report.';
  if (action === 'query') return 'Something went wrong while filtering the directory.';
  return 'Something went wrong while processing your request.';
};
