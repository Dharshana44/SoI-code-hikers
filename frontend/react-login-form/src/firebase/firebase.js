// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, OAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBj3VK9S5iMakjMb6JuvzZeqCe-1nXwPfM",
  authDomain: "smart-tourism-51fc1.firebaseapp.com",
  projectId: "smart-tourism-51fc1",
  storageBucket: "smart-tourism-51fc1.firebasestorage.app",
  messagingSenderId: "628264940043",
  appId: "1:628264940043:web:edfd4fe2c46c556a77cd0e",
  measurementId: "G-04F2QTV9JV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { auth, googleProvider, appleProvider,GoogleAuthProvider, OAuthProvider };