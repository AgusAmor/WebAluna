import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2-Xuu8gvIs-4earumK3C4NKCiiWC0kFU",
  authDomain: "aluna-1af1f.firebaseapp.com",
  projectId: "aluna-1af1f",
  storageBucket: "aluna-1af1f.firebasestorage.app",
  messagingSenderId: "800956806640",
  appId: "1:800956806640:web:e126416861176cb8f6d935",
  measurementId: "G-05WBW9MV7V",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
