import Key from '../key.js';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
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

let userInGoogle = null;
let userInFirestore = null;
let readyGame = null;



onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        userInGoogle = user;
        const uid = user.uid;
        console.log('user signed in', uid);
        userInFirestore = await getUserInFirestore(uid);
        window.onSignIn(user);

        const games = await getGamesInFirestore();
        window.setGames(games);
        window.setMyPointInBetting(userInFirestore.point);
        // readyGame = games.find(game => game.isReady);
        // if (readyGame) {
        //     window.setGameReady(readyGame);
            
        //     if (setMyPointInBetting) {
        //         
        //     }
        // }
    } else {
        userInGoogle = null;
        window.onSignOut();
        console.log('user signed out');
    }
  });
  
window.signInWithPopup = function() {
    console.log('signInWithPopup');
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

window.logout = function() {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}

async function getUserInFirestore(uid) {
    const docRef = doc(db, "members", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        return null;
    }
}

async function getGamesInFirestore() {
    const gamesQuerySnapshot = await getDocs(collection(db, "games"));
    const games = gamesQuerySnapshot.docs
        .map(doc => doc.data());
    return games;
}

const membersQuerySnapshot = await getDocs(collection(db, "members"));
const members = membersQuerySnapshot.docs
    .map(doc => doc.data())
    .sort((a, b) => b.point - a.point);


window.setRankBox(members);

// const games = gamesQuerySnapshot.docs
//     .map(doc => doc.data());

window.getLogsInGame = async function(gameId) {
    const logInGameQuerySnapshot = await getDocs(collection(db, "games", gameId, "members"));
    return logInGameQuerySnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => b.createdAt - a.createdAt);
}

window.getLogsInMember = async function(uid) {
    const logInMemberQuerySnapshot = await getDocs(collection(db, "members", uid, "games"));
    return logInMemberQuerySnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => b.createdAt - a.createdAt);
}

window.betting = async function(gameId, selecOption, point) {
    return new Promise((resolve, reject) => {
        const functionName = 'betting';
        const queryParameters = {
            selecOption,
            point,
            gameId,
        };
        const queryString = Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&');
        // const baseUrl = 'https://asia-northeast3-logifestival.cloudfunctions.net';
        const baseUrl = 'http://localhost:5001/logifestival/asia-northeast3/betting';
        const functionUrl = `${baseUrl}/${functionName}?${queryString}`;

        httpsCallableFromURL(
            functions, 
            functionUrl,
        )()
            .then((result) => {
                // // Read result of the Cloud Function.
                // /** @type {any} */
                // const data = result.data;
                // const sanitizedMessage = data.text;
                console.log({
                    result,
                });
                resolve(result.data);
            }).catch(err => {
                console.log({
                    err,
                    // code,
                    // message,
                    // details,
                });
                resolve(err.data);
            })
    });
}

window.cancelBetting = async function(logId) {
    return new Promise((resolve, reject) => {
        const functionName = 'cancelBet';
        const queryParameters = {
            logId,
        };
        const queryString = Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&');
        // const baseUrl = 'https://asia-northeast3-logifestival.cloudfunctions.net';
        const baseUrl = 'http://localhost:5001/logifestival/asia-northeast3/cancelBet';
        const functionUrl = `${baseUrl}/${functionName}?${queryString}`;

        httpsCallableFromURL(
            functions, 
            functionUrl,
        )()
            .then((result) => {
                // // Read result of the Cloud Function.
                // /** @type {any} */
                // const data = result.data;
                // const sanitizedMessage = data.text;
                console.log({
                    result,
                });
                resolve(result.data);
            }).catch(err => {
                console.log({
                    err,
                    // code,
                    // message,
                    // details,
                });
                resolve(err.data);
            })
    });
}