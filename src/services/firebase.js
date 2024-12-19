// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG7jCmN_7BDZB0FJv8XlhQbrjfAXJ5Xfg",
  authDomain: "ssss-a16e6.firebaseapp.com",
  databaseURL: "https://ssss-a16e6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ssss-a16e6",
  storageBucket: "ssss-a16e6.firebasestorage.app",
  messagingSenderId: "350473624117",
  appId: "1:350473624117:web:5216b63f7412a1b563af7c"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;