import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBrmlEJFtjP2vzmOQHj9-YMhlWGSf7ZkSE",
  authDomain: "sbt-database-54267.firebaseapp.com",
  projectId: "sbt-database-54267",
  storageBucket: "sbt-database-54267.firebasestorage.app",
  messagingSenderId: "381445075009",
  appId: "1:381445075009:web:5ded684e2122ac367a16c0"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;