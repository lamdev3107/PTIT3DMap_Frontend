import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC5wb6AR-M7wsx2BQKoZas7vmlJll_hmxc",
  authDomain: "whatapps-clone-c9c98.firebaseapp.com",
  projectId: "whatapps-clone-c9c98",
  storageBucket: "whatapps-clone-c9c98.appspot.com",
  messagingSenderId: "16252239139",
  appId: "1:16252239139:web:bffcce13d91c6a657d6096",
  measurementId: "G-HEZNJXBXRP",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
