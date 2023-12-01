import fb from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseApp = fb.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "devblog-7683a.firebaseapp.com",
  projectId: "devblog-7683a",
  storageBucket: "devblog-7683a.appspot.com",
  messagingSenderId: "200791553786",
  appId: "1:200791553786:web:047a51d784334bd98b7b43"
});

const db = firebaseApp.firestore();
const auth = fb.auth();
const storage = fb.storage();

export { db, auth, storage, fb };
