
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADdI7QINSVwSUAjuQfq3vaot8iCq8fay4",
  authDomain: "dvchecker.firebaseapp.com",
  projectId: "dvchecker",
  storageBucket: "dvchecker.firebasestorage.app",
  messagingSenderId: "1028198731290",
  appId: "1:1028198731290:web:1e8032e9db37a99f064ba3",
  measurementId: "G-SV19J8G2KY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)})
export const db = getFirestore(app)

// const analytics = getAnalytics(app);