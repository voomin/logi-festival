const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
    origin: true
});
const seoul = functions.region('asia-northeast3');

admin.initializeApp();

async function getUid(req) {
    // 사용자의 ID 토큰을 요청에서 가져옵니다.
    const idToken = req.get('Authorization');

    // Firebase Authentication을 사용하여 사용자를 인증합니다.
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    return decodedIdToken.uid || null;
}

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
    cors(req, res, async ()=>{
        try {
            const { selecOption, point, gameId } = req.body;
            if (!selecOption || !point || !gameId) {
                throw new Error('selecOption, point, gameId가 필요합니다.');
            }
            
            const uid = getUid(req);

            const userRef = admin.firestore().collection('members').doc(uid); 
            const gameRef = admin.firestore().collection('games').doc(gameId);
            const logInMemberRef = admin.firestore().collection('members').doc(uid).collection('games');
            const logInGameRef = admin.firestore().collection('games').doc(gameId).collection('members').doc(uid);

            
            await admin.firestore().runTransaction(async (transaction) => {
                const gameDoc = await transaction.get(gameRef);
                const userDoc = await transaction.get(userRef);
                const game = gameDoc.data();
                const user = userDoc.data();
                const log = {
                    selecOption,
                    bettingPoint: point,
                    bettingRate: game.bettingRate,
                    gameNmae: game.name,
                    userName: user.name,
                    userPoint: user.point,
                    gameId,
                    uid,
                };

                if (user.point < point) {
                    throw new Error('포인트가 부족합니다.');
                }
                
                user.point -= point;

                await transaction.update(userRef, user);
                await transaction.set(logInMemberRef.add(log));
                await transaction.set(logInGameRef, log);
            });

            if (uid) {
                res.json({
                    selecOption,
                    point,
                    gameId,
                    uid,
                });
            } else {
                throw new Error('uid가 존재하지 않습니다.');
            }
        } catch(error) {
            console.error(error);
            res
                .status(500)
                .json({
                    error: error.message,
                });
        }
    });
});