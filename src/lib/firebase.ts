
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Add other Firebase services as needed, e.g., getAuth

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual config from the Firebase console
// You can find this in your Firebase project settings -> General -> Your apps -> Web app SDK configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your API key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your Auth domain
  projectId: "YOUR_PROJECT_ID", // Replace with your Project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your Storage Bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your Messaging Sender ID
  appId: "YOUR_APP_ID" // Replace with your App ID
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully!"); // Log successful initialization
} else {
  app = getApp();
  console.log("Firebase app already exists."); // Log if app already exists
}

const db = getFirestore(app);

export { app, db };
