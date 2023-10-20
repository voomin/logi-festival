import Key from 'key';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, getDoc, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable, httpsCallableFromURL } from "firebase/functions";

const firebaseConfig = Key.firebaseConfig;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    'login_hint': 'int@logibros.com'
});

export default class FirebaseManager {
    static auth = auth;
    static db = db;
    static functions = functions;
    static provider = provider;

    // static functionsApiUrl = 'https://asia-northeast3-logifestival.cloudfunctions.net';
    static functionsApiUrl = 'http://localhost:5001/logifestival/asia-northeast3';
}