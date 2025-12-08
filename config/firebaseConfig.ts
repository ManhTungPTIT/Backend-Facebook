// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA2bEhvOwX1Aeim6-JT2EPnr_b5rCuV38",
  authDomain: "facebook-1b85c.firebaseapp.com",
  projectId: "facebook-1b85c",
  storageBucket: "facebook-1b85c.firebasestorage.app",
  messagingSenderId: "1029963932405",
  appId: "1:1029963932405:web:1aaf9a9c1dee008add9bbc",
  measurementId: "G-PDWR3PLLBJ",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
