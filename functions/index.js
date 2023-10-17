const functions = require('firebase-functions');
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const cors = require('cors')({
    origin: true
});
const { v4: uuidv4 } = require('uuid');

const seoul = functions.region('asia-northeast3');

admin.initializeApp();

exports.helloWorld = seoul.https.onRequest((req, res) => {
    cors(req, res, async ()=>{
        try {
            const text = req.query.text || "default text";

            const documentId = 'your-document-id'; // 업데이트할 Firestore 문서의 ID
            const newData = {
                // 업데이트할 데이터 필드 및 값
                field1: 'new-value-1',
                field2: 'new-value-2',
                text,
            };

            const documentRef = admin.firestore()
                .collection('your-collection').doc(documentId);
            await documentRef.set(newData);
            
            res.send(`Hello from Firebase! text: ${text}`);
        } catch(error) {
            res
                .status(500)
                .send(`Hello from Firebase! error: ${error}`);
        }

    });
});

exports.welcomeLogibros = seoul.auth.user().onCreate((user) => {
  try {
    const { uid, displayName, email, photoURL } = user;

    // if (email.endsWith('@logibros.com') === false) {
    //     return;
    // }

    const userRef = admin.firestore().collection('members').doc(uid);
    userRef.set({
      uid,
      name: displayName,
      email,
      photoURL,
      point: 1000,
      team: '',
    });

  } catch(error) {
    console.error(error);
  } 
});

exports.betting = seoul.https.onRequest((req, res) => {
    let logs = [];
    cors(req, res, async ()=>{
        try {
            const { selecOption, point, gameId } = req.query;
            if (!selecOption || !point || !gameId) {
                throw new Error('selecOption, point, gameId가 필요합니다.');
            }
            if (point <= 0) {
                throw new Error('비정상적인 값입니다.');
            }

            // 요청에서 사용자 ID 토큰 가져오기
            let idToken = req.headers.authorization;
            if (idToken.startsWith('Bearer ')) {
                // Remove Bearer from string
                idToken = idToken.slice(7, idToken.length);
            }
            
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;

            logs.push(`uid: ${uid}`);
            if (!uid) {
                throw new Error('uid가 존재하지 않습니다.');
            }

            const userRef = admin.firestore().collection('members').doc(uid);
            const gameRef = admin.firestore().collection('games').doc(gameId);
            const logId = uuidv4();

            const logInMemberRef = admin.firestore().collection('members').doc(uid).collection('games').doc(logId);
            const logInGameRef = admin.firestore().collection('games').doc(gameId).collection('members').doc(logId);
            
            let myPoint = 0;

            await admin.firestore().runTransaction(async (transaction) => {
                const gameDoc = await transaction.get(gameRef);
                if (!gameDoc.exists) {
                    throw new Error('게임이 존재하지 않습니다.');
                }
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists) {
                    throw new Error('유저가 존재하지 않습니다.');
                }
                const game = gameDoc.data();
                const user = userDoc.data();
                const log = {
                    id: logId,
                    selecOption,
                    bettingPoint: point,
                    bettingRate: game.bettingRate,
                    gameName: game.name,
                    userName: user.name,
                    userPoint: user.point,
                    gameId,
                    uid,
                    createdAt: new Date(),
                };

                if (user.point < point) {
                    throw new Error('포인트가 부족합니다.');
                }
                
                user.point -= point;

                await transaction.update(userRef, user);
                await transaction.set(logInMemberRef, log);
                await transaction.set(logInGameRef, log);

                myPoint = user.point;
            });


            res.json({
                data: {
                    myPoint,
                }
            });

        } catch(error) {
            res
                // .status(500)
                .json({
                    data: {
                        isErr: true,
                        message: error.message,
                        logs,
                    }
                });
        }
    });
});