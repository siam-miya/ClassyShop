import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // এটি যোগ করা হয়েছে

const firebaseConfig = {
  apiKey: "AIzaSyB6TF2YZ0Q-JNQMmEOM-i7eh5YswIU8ELI",
  authDomain: "classyshop-dfe46.firebaseapp.com",
  projectId: "classyshop-dfe46",
  storageBucket: "classyshop-dfe46.firebasestorage.app",
  messagingSenderId: "790693486003",
  appId: "1:790693486003:web:11fb679d33b99397753fc6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // এটি এক্সপোর্ট করা হলো