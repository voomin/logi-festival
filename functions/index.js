const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {onRequest} = require("firebase-functions/v2/https");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.betting = onRequest(async (req, res) => {
    const {
        point,
        selectOption,
        gameId,
    } = req.query;

    res.json({
        point,
        selectOption,
        gameId,
        result: `betting Hello point: ${point}!`,
    });
});
