// firebaseConfig.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsO4GYNHvI2IdWb7CQ1O94_vGDaeVlUfY",
  authDomain: "phoneverification-b1910.firebaseapp.com",
  projectId: "phoneverification-b1910",
  storageBucket: "phoneverification-b1910.firebasestorage.app",
  messagingSenderId: "734925717212",
  appId: "1:734925717212:web:a1277f926c38d1cb963e19",
  measurementId: "G-JDTEY8QN76"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase,firebaseConfig };