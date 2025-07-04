
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  getDocs,
  where,
  writeBatch,
  deleteDoc,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
  serverTimestamp // Import serverTimestamp
} from 'firebase/firestore';
import type { FirebaseError } from 'firebase/app'; // Import FirebaseError type for better error handling

// Define interfaces matching Firestore data structures
export interface ForumData {
  id: string; // Firestore document ID
  subject: string;
  faculty: string;
  slug: string;
  batch: string;
  createdAt: Timestamp; // Use Firestore Timestamp
}

export interface ReviewData {
  id: string; // Firestore document ID
  text: string;
  timestamp: Timestamp; // Use Firestore Timestamp
  // forumSlug is implied by the subcollection path
}


// --- Forum Operations ---

/**
 * Adds a new forum document to the 'forums' collection.
 * Automatically generates slug and adds createdAt timestamp.
 * @param forumData - The data for the new forum (subject, faculty, batch).
 * @returns The newly created ForumData object with ID.
 * @throws Throws an error if adding the document fails.
 */
export const addForum = async (forumData: Omit<ForumData, 'createdAt' | 'slug' | 'id'>): Promise<ForumData> => {
  try {
    // Simple slug generation (replace spaces with hyphens, lowercase)
    const slug = forumData.subject.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); // Basic sanitization

    const docRef = await addDoc(collection(db, 'forums'), {
      ...forumData,
      slug: slug, // Add generated slug
      createdAt: serverTimestamp() // Use server timestamp for consistency
    });
    console.log('Forum added successfully with ID:', docRef.id);
    // Return the full data including the generated ID and placeholder timestamp (actual value set by server)
    return {
        ...forumData,
        id: docRef.id,
        slug: slug,
        createdAt: Timestamp.now() // Placeholder, actual value is server-generated
    };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    console.error("Error adding forum: ", firebaseError.message, firebaseError.code);
    throw new Error(`Failed to create forum: ${firebaseError.message}`); // Re-throw with specific message
  }
};

/**
 * Sets up a real-time listener for the 'forums' collection, ordered by creation date.
 * @param callback - Function to be called with the forums data whenever it changes.
 * @param onError - Optional function to handle errors during listening.
 * @returns An unsubscribe function to stop listening.
 */
export const getForumsStream = (
    callback: (forums: ForumData[]) => void,
    onError?: (error: FirebaseError) => void
): Unsubscribe => {
    const q = query(collection(db, "forums"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q,
        (querySnapshot: QuerySnapshot<DocumentData>) => {
            const forums = querySnapshot.docs.map(doc => ({
                id: doc.id, // Include document ID
                ...doc.data()
            } as ForumData)); // Cast directly to ForumData
            callback(forums);
        },
        (error: FirebaseError) => { // Explicitly type the error
            console.error("Error listening to forums: ", error.message, error.code);
            if (onError) {
                onError(error); // Call the provided error handler
            }
        }
    );

    return unsubscribe; // Return the unsubscribe function
};


// --- Review Operations ---

/**
 * Adds a new review to the subcollection of a specific forum.
 * @param forumSlug - The slug of the forum to add the review to.
 * @param reviewData - The data for the new review (just the text).
 * @returns The newly created ReviewData object with ID.
 * @throws Throws an error if forumSlug is missing or adding the document fails.
 */
export const addReview = async (forumSlug: string, reviewData: Omit<ReviewData, 'timestamp' | 'id'>): Promise<ReviewData> => {
  if (!forumSlug) {
      console.error("Error adding review: Forum slug is missing.");
      throw new Error("Forum identifier is missing.");
  }
  try {
    // Reference the subcollection directly using the slug
    const reviewsCollectionRef = collection(db, 'forums', forumSlug, 'reviews');
    const docRef = await addDoc(reviewsCollectionRef, {
      ...reviewData,
      timestamp: serverTimestamp() // Use server timestamp
    });
    console.log('Review added successfully with ID:', docRef.id, 'to forum:', forumSlug);
     return {
        ...reviewData,
        id: docRef.id,
        timestamp: Timestamp.now() // Placeholder, actual value is server-generated
    };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    console.error("Error adding review: ", firebaseError.message, firebaseError.code);
    throw new Error(`Failed to submit review: ${firebaseError.message}`); // Re-throw with specific message
  }
};

/**
 * Sets up a real-time listener for the reviews subcollection of a specific forum.
 * Converts Firestore Timestamps to JS Date objects in the callback.
 * @param forumSlug - The slug of the forum whose reviews are to be fetched.
 * @param callback - Function to be called with the reviews data (timestamps as Date objects).
 * @param onError - Optional function to handle errors during listening.
 * @returns An unsubscribe function to stop listening, or null if forumSlug is invalid.
 */
export const getReviewsStream = (
    forumSlug: string,
    callback: (reviews: ReviewData[]) => void,
    onError?: (error: FirebaseError) => void
): Unsubscribe | null => {
    if (!forumSlug) {
        console.error("Error getting reviews stream: Forum slug is missing.");
        if (onError) onError(new Error("Forum slug is missing.") as FirebaseError); // Notify caller
        return null; // Return null or handle appropriately
    }

    try {
        const reviewsCollectionRef = collection(db, 'forums', forumSlug, 'reviews');
        const q = query(reviewsCollectionRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q,
            (querySnapshot: QuerySnapshot<DocumentData>) => {
                const reviews = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id, // Include document ID
                        text: data.text,
                        // IMPORTANT: Convert Firestore Timestamp to JS Date object
                        timestamp: (data.timestamp as Timestamp)?.toDate() ?? new Date(), // Handle potential null/undefined timestamp during creation
                    } as ReviewData; // Ensure type safety
                });
                callback(reviews);
            },
            (error: FirebaseError) => { // Explicitly type the error
                console.error(`Error listening to reviews for ${forumSlug}: `, error.message, error.code);
                 if (onError) {
                     onError(error); // Call the provided error handler
                 }
            }
        );

        return unsubscribe; // Return the unsubscribe function
    } catch (error) {
        const firebaseError = error as FirebaseError;
        console.error(`Error setting up listener for ${forumSlug}: `, firebaseError.message, firebaseError.code);
        if (onError) onError(firebaseError); // Notify caller
        return null; // Return null on error during setup
    }
};


// --- Example for Deleting a Forum and its Reviews (using Batch Write) ---
/**
 * Deletes a forum and all its associated reviews within a batch write.
 * @param forumSlug - The slug of the forum to delete.
 * @throws Throws an error if forumSlug is missing or deletion fails.
 */
export const deleteForumAndReviews = async (forumSlug: string): Promise<void> => {
    if (!forumSlug) {
        console.error("Error deleting forum: Forum slug is missing.");
        throw new Error("Forum identifier is missing.");
    }
    try {
        // Use the slug directly as the document ID in the 'forums' collection
        const forumDocRef = doc(db, 'forums', forumSlug);
        const reviewsCollectionRef = collection(db, 'forums', forumSlug, 'reviews');

        // Get all review documents to delete
        const reviewsSnapshot = await getDocs(reviewsCollectionRef);

        // Create a batch
        const batch = writeBatch(db);

        // Add delete operations for each review to the batch
        reviewsSnapshot.docs.forEach((reviewDoc) => {
            batch.delete(reviewDoc.ref);
        });

        // Add delete operation for the forum document itself
        batch.delete(forumDocRef);

        // Commit the batch
        await batch.commit();
        console.log(`Forum '${forumSlug}' and its reviews deleted successfully.`);

    } catch (error) {
        const firebaseError = error as FirebaseError;
        console.error("Error deleting forum and reviews: ", firebaseError.message, firebaseError.code);
        throw new Error(`Failed to delete forum: ${firebaseError.message}`); // Re-throw with specific message
    }
};
