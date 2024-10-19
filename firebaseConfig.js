// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY7JvBtar-Jjx_rOkDvzWlb7pRBeFpdzI",
  authDomain: "movienight-b60a3.firebaseapp.com",
  projectId: "movienight-b60a3",
  storageBucket: "movienight-b60a3.appspot.com",
  messagingSenderId: "150677226247",
  appId: "1:150677226247:web:2945c2859974ea0ed13ba2"
};
// Check if Firebase has been initialized already
let app;

if (!getApps().length) {
  // Initialize Firebase only if there are no apps initialized
  app = initializeApp(firebaseConfig);
} else {
  // Use the existing app instance
  app = getApp();
}

// Export both `auth` and `db`
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;