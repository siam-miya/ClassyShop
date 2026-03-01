import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6TF2YZ0Q-JNQMmEOM-i7eh5YswIU8ELI",
  authDomain: "classyshop-dfe46.firebaseapp.com",
  projectId: "classyshop-dfe46",
  storageBucket: "classyshop-dfe46.firebasestorage.app",
  messagingSenderId: "790693486003",
  appId: "1:790693486003:web:11fb679d33b99397753fc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export everything together at the end
export { app, db, auth, storage };