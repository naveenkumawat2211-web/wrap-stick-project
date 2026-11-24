import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDk3C5-7C-yn0WuN2io-jXrUp7ks_91PJc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'wrap-stick-gudha.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'wrap-stick-gudha',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'wrap-stick-gudha.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '455007547970',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:455007547970:web:5573affcabb72ec2d9b3db'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };
