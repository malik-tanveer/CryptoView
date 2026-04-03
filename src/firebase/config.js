// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0Wyip-MK1amFChJ6cv7g6dWrv0dJtOqM",
  authDomain: "crypto-8a576.firebaseapp.com",
  projectId: "crypto-8a576",
  storageBucket: "crypto-8a576.appspot.com",
  messagingSenderId: "180399327671",
  appId: "1:180399327671:web:f93c0e6d490e0da1368032",
  measurementId: "G-LZQ6LEKS0N",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);