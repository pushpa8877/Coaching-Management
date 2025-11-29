// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  

// Your Firebase config (from your project: coaching-dcd98)
const firebaseConfig = {
  apiKey: "AIzaSyCu2SWsUGpGS_7akzZlmM2QUIfBvrkpR6A",
  authDomain: "coaching-dcd98.firebaseapp.com",
  projectId: "coaching-dcd98",
  storageBucket: "coaching-dcd98.firebasestorage.app",
  messagingSenderId: "868804688994",
  appId: "1:868804688994:web:9d2efdb4d44abbb1f5653b",
  measurementId: "G-08QPXE8KEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: export app if you need it elsewhere
export default app;