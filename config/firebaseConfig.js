import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAcLvI3xNa4Q8yb38oyV_GrDVYrhszw5jY",
  authDomain: "student-budget-tracker-ece83.firebaseapp.com",
  projectId: "student-budget-tracker-ece83",
  storageBucket: "student-budget-tracker-ece83.firebasestorage.app",
  messagingSenderId: "112807696395",
  appId: "1:112807696395:web:1f325dffc79c1d5e514f0e"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;