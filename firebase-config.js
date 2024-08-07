// firebase-config.js
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXZ1ur4wLkxhXbJlRDN5-DJkX2HsO-FWQ",
  authDomain: "hpsc-ims-88825.firebaseapp.com",
  projectId: "hpsc-ims-88825",
  storageBucket: "hpsc-ims-88825.appspot.com",
  messagingSenderId: "537018125660",
  appId: "1:537018125660:web:2f1e25cb913beeb4948599",
  measurementId: "YOUR_MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
