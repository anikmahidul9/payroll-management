import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc-KUCnbxB06DihJwndkB0FDcT09BbAHw",
  authDomain: "simple-firebase-authin.firebaseapp.com",
  projectId: "simple-firebase-authin",
  storageBucket: "simple-firebase-authin.firebasestorage.app",
  messagingSenderId: "958799659537",
  appId: "1:958799659537:web:4652be2a229b89c07fe7b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
