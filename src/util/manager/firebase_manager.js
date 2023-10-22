import Key from 'key';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, httpsCallable, httpsCallableFromURL } from "firebase/functions";

const firebaseConfig = Key.firebaseConfig;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const provider = new GoogleAuthProvider();

const env = process.env.NODE_ENV;

let functionsApiUrl = 'https://asia-northeast3-logifestival.cloudfunctions.net';

console.log('env', env);
// 개발 환경일 경우에만 로컬 서버 연결
if (env === 'development') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    functionsApiUrl = 'http://localhost:5001/logifestival/asia-northeast3';
}

provider.setCustomParameters({
    'login_hint': 'int@logibros.com'
});

export default class FirebaseManager {
    static auth = auth;
    static db = db;
    static functions = functions;
    static provider = provider;
    static functionsApiUrl = functionsApiUrl;
}