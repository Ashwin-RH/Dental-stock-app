// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCF5RzPct1Eegu4IREYe2zskEbgKgn4Pk",
  authDomain: "sam-stock-manager.firebaseapp.com",
  projectId: "sam-stock-manager",
  storageBucket: "sam-stock-manager.firebasestorage.app",
  messagingSenderId: "550813447139",
  appId: "1:550813447139:web:9f39933962354ddb23e6d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ THIS LINE FIXES EVERYTHING
export const db = getFirestore(app);
