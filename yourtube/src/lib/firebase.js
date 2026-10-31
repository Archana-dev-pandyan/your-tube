// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
/* import { getAnalytics } from "firebase/analytics"; */
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZy_XtqDC_6OXcZWjABBHaVfVqx9ChZx8",
  authDomain: "yourtube-69d90.firebaseapp.com",
  projectId: "yourtube-69d90",
  storageBucket: "yourtube-69d90.firebasestorage.app",
  messagingSenderId: "872028964708",
  appId: "1:872028964708:web:c97bc716bb41962a445c71",
  measurementId: "G-MVT3HDTEPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/* const analytics = getAnalytics(app); */
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export  {auth,provider}