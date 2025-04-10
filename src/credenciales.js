// src/credenciales.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3db4dCU4tUcSgp1Cc3NZH4e9_zMCqhx8",
  authDomain: "estudio-1be51.firebaseapp.com",
  projectId: "estudio-1be51",
  storageBucket: "estudio-1be51.appspot.com",
  messagingSenderId: "880349159898",
  appId: "1:880349159898:web:e15629c7213e5d43d620e3"
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

export { appFirebase, db, auth };
