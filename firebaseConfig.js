// firebaseConfig.js
import firebase from 'firebase/app';
import 'firebase/auth'; // Import authentication
import 'firebase/firestore'; // Import firestore
import { firebaseConfig } from '@env'; // Import the Firebase config from .env

// Check if Firebase is already initialized, else initialize it
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // If already initialized, use the existing app instance
}

export { firebase };
