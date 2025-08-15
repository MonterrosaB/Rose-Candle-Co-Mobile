// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBN4FW2kAQQ12ZUqhMGWCoGF8BRKAVmIso",
  authDomain: "phoneverification-b1910.firebaseapp.com",
  projectId: "phoneverification-b1910",
  storageBucket: "phoneverification-b1910.appspot.com",
  messagingSenderId: "734925717212",
  appId: "1:734925717212:android:8eff74b301072efe963e19",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export {auth, RecaptchaVerifier, signInWithPhoneNumber };