// firebaseConfig.js
import { firebase } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBN4FW2kAQQ12ZUqhMGWCoGF8BRKAVmIso",
  authDomain: "phoneverification-b1910.firebaseapp.com",
  projectId: "phoneverification-b1910",
  storageBucket: "phoneverification-b1910.appspot.com",
  messagingSenderId: "734925717212",
  appId: "1:734925717212:android:8eff74b301072efe963e19",
};

// Inicializa Firebase (solo si no está inicializado)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebaseConfig, auth };
