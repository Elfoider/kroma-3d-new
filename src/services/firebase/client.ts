// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDad78dDrCfmd-1kBPes9Gkwgr9gfjgXvI",
  authDomain: "smart-savings-4be47.firebaseapp.com",
  projectId: "smart-savings-4be47",
  storageBucket: "smart-savings-4be47.firebasestorage.app",
  messagingSenderId: "538090496490",
  appId: "1:538090496490:web:7858f9588f1072eed05293",
  measurementId: "G-S1T7X5Z923",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
