import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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