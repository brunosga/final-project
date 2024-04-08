//  necessary dependencies
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { getStorage } from 'firebase/storage';

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHtJSnYl9RyQdm3YiDHLGxWpq5-5rANtA",
    authDomain: "diningin-e1742.firebaseapp.com",
    projectId: "diningin-e1742",
    storageBucket: "diningin-e1742.appspot.com",
    messagingSenderId: "653988425108",
    appId: "1:653988425108:web:cd29832085f059a2ff7381",
    measurementId: "G-QXHWDGZGME"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { db, auth, storage }; // Export the database, auth, and storage

