const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true
});

// // The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// const {onRequest} = require("firebase-functions/v2/https");
// // The Firebase Admin SDK to access Firestore.
// const {initializeApp} = require("firebase-admin/app");
// const {getFirestore, doc, setDoc} = require("firebase-admin/firestore");

// initializeApp();

// // Initialize Cloud Firestore and get a reference to the service
// const db = getFirestore(app);


exports.helloWorld = functions
    .region('asia-northeast3')
    .https.onRequest((req, res) => {
    cors(req, res, async ()=>{
        const text = req.query.text || "default text";
        // await setDoc(doc(db, "test", "A"), {
        //     text,
        //   });
          
        res.send(`Hello from Firebase! text: ${text}`);

    });
});


// exports.betting = functions.https.onRequest(async (req, res) => {
//     cors(req, res, ()=>{
//         const {
//             point,
//             selectOption,
//             gameId,
//         } = req.query;
    
//         res.json({
//             point,
//             selectOption,
//             gameId,
//             result: `betting Hello point: ${point}!`,
//         });
//     });
// });
