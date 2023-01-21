// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkOX7lJq11MNJYg2-WyZPaqnVoe0BKVpc",
  authDomain: "pianisto-f268c.firebaseapp.com",
  projectId: "pianisto-f268c",
  storageBucket: "pianisto-f268c.appspot.com",
  messagingSenderId: "293707653819",
  appId: "1:293707653819:web:5e8bb027b6f77bb3afff9e",
  measurementId: "G-P48JMEF9HD",
};

const app = initializeApp(firebaseConfig);
export const google = new GoogleAuthProvider();
export const fb = new FacebookAuthProvider();
export const fireDB = getFirestore(app);
export const auth = getAuth();
