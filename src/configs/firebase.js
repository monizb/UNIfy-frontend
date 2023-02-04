import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCf60bPZ0U03R3AitAysQ_5OJAvCcGoK9E",
    authDomain: "UNIfy-f3885.firebaseapp.com",
    projectId: "UNIfy-f3885",
    storageBucket: "UNIfy-f3885.appspot.com",
    messagingSenderId: "729230393867",
    appId: "1:729230393867:web:448e40e347f95de5acfd0e",
    measurementId: "G-WBW3GCV1W9"
};

firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
export const firebaseAuth = firebase.auth();

