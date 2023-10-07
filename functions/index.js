const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// const {getFunctions, connectFunctionsEmulator} = require("firebase-functions");
// // const {onRequest} = require("firebase-functions/v2/https");
// const {getApp} = require("firebase/app");
// const {initializeApp} = require("firebase-admin/app");
// // const {getFirestore} = require("firebase-admin/firestore");

// const functions = getFunctions(getApp());

// initializeApp({
//     apiKey: "AIzaSyB-5HRZZzrug4moRqhNV4-BBXnN5w7_bMg",
//     authDomain: "logifestival.firebaseapp.com",
//     projectId: "logifestival",
//     storageBucket: "logifestival.appspot.com",
//     messagingSenderId: "504262957769",
//     appId: "1:504262957769:web:d5b9e337dd4b663b894b18",
//     measurementId: "G-Z6D3QV3JDQ"
// });

// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
//   });

// // exports.betting = onRequest(async (req, res) => {
// //     const {
// //         point,
// //         selectOption,
// //         gameId,
// //     } = req.query;
// //     const uid = request.auth.uid;

    
// //     // const writeResult = await getFirestore()
// //     //     .collection("messages")
// //     //     .add({original: original});
    

// //     res.json({
// //         result: `betting Hello point: ${point}!`,
// //     });
// // });

// // exports.gameover = onRequest(async (req, res) => {

// // });