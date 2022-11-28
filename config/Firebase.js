import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBStmdDQzenW5Fj3VBvbpO8h6VDiseVFmU",
  authDomain: "linktree-97950.firebaseapp.com",
  projectId: "linktree-97950",
  storageBucket: "linktree-97950.appspot.com",
  messagingSenderId: "849583690787",
  appId: "1:849583690787:web:93db54063e9c3849b90d96",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider, db };
