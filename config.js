import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAboyYoGKUzJECsF1uyUa6_mH8MdrKyG9E",
    authDomain: "fir-ex-2a39e.firebaseapp.com",
    projectId: "fir-ex-2a39e",
    storageBucket: "fir-ex-2a39e.appspot.com",
    messagingSenderId: "428741342156",
    appId: "1:428741342156:web:aaa078fa444b7b96136369"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export { firebase };