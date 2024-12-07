import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCEZBcOTQ73OE-E4x9gAOaDeO1cydfKBIw",
  authDomain: "worksheet-generator-c8b03.firebaseapp.com",
  projectId: "worksheet-generator-c8b03",
  storageBucket: "worksheet-generator-c8b03.firebasestorage.app",
  messagingSenderId: "721134492745",
  appId: "1:721134492745:web:0f06a40a2274c4a7e2f398",
  measurementId: "G-RZ7J5QGBJM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Add more detailed console logging for debugging
auth.onAuthStateChanged((user) => {
  console.log("Auth state changed:", user ? "User logged in" : "User logged out");
  if (user) {
    console.log("User ID:", user.uid);
  }
});