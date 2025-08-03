// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBR-8bQs3aYk0jldgSESPN85hmuX_fPxVQ",
  authDomain: "pink-city-desire.firebaseapp.com",
  projectId: "pink-city-desire",
  storageBucket: "pink-city-desire.firebasestorage.app",
  messagingSenderId: "52410320760",
  appId: "1:52410320760:web:725c9ee1b9be1564656a8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);