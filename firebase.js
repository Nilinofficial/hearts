
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyBFag8SckCDyt_U6hgLahIRM22-0ewCOMc",
    authDomain: "hearts-db62b.firebaseapp.com",
    projectId: "hearts-db62b",
    storageBucket: "hearts-db62b.appspot.com",
    messagingSenderId: "832183223189",
    appId: "1:832183223189:web:84f319de57b9406d60ac9c",
    measurementId: "G-67GDX1DH8H"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db  = getFirestore();

  export {auth,db};
  