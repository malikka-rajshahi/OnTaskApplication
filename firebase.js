import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// App's Firebase configuration
const firebaseConfig = {
  // apiKey:            redacted sensitive information,
  // authDomain:        redacted sensitive information,
  // projectId:         redacted sensitive information,
  // storageBucket:     redacted sensitive information,
  // messagingSenderId: redacted sensitive information,
  // appId:             redacted sensitive information,
  // measurementId:     redacted sensitive information
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { firestore, auth };