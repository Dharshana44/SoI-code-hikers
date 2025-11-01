// Firebase initialization adapted from the provided react-login-form
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { GoogleAuthProvider, OAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBj3VK9S5iMakjMb6JuvzZeqCe-1nXwPfM",
  authDomain: "smart-tourism-51fc1.firebaseapp.com",
  projectId: "smart-tourism-51fc1",
  storageBucket: "smart-tourism-51fc1.firebasestorage.app",
  messagingSenderId: "628264940043",
  appId: "1:628264940043:web:edfd4fe2c46c556a77cd0e",
  measurementId: "G-04F2QTV9JV"
};

const app = initializeApp(firebaseConfig);
try { getAnalytics(app); } catch (e) { /* analytics may fail in some environments */ }
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { auth, googleProvider, appleProvider };
