// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "plot-a-plot.firebaseapp.com",
  projectId: "plot-a-plot",
  storageBucket: "plot-a-plot.appspot.com",
  messagingSenderId: "484891952767",
  appId: "1:484891952767:web:6c6d09ca1fae799cf4e14a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);