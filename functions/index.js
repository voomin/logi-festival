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

exports.goodbyeLogibros = seoul.auth.user().onDelete((user) => {
    try {
        const { uid } = user;
    
        const userRef = admin.firestore().collection('members').doc(uid);
        userRef.delete();
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

                if (!game.isOnBetting) {
                    throw new Error('배팅이 중지된 게임입니다.');
                }

                if (user.point < point) {
                    throw new Error('포인트가 부족합니다.');
                }
                
                user.point -= point;

                const log = {
                    id: logId,
                    selecOption,
                    bettingPoint: point,
                    gameName: game.name,
                    userName: user.name,
                    userPoint: user.point,
                    gameId,
                    uid,
                    createdAt: new Date(),
                };

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

exports.cancelBet = seoul.https.onRequest((req, res) => {
    cors(req, res, async ()=>{
        try {
            const { logId } = req.query;
            if (!logId) {
                throw new Error('logId가 필요합니다.');
            }

            // 요청에서 사용자 ID 토큰 가져오기
            let idToken = req.headers.authorization;
            if (idToken.startsWith('Bearer ')) {
                // Remove Bearer from string
                idToken = idToken.slice(7, idToken.length);
            }
            
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;
            
            const userRef = admin.firestore().collection('members').doc(uid);
            const logInMemberRef = admin.firestore().collection('members').doc(uid).collection('games').doc(logId);
            
            let myPoint = 0;

            await admin.firestore().runTransaction(async (transaction) => {
                const logInMemberDoc = await transaction.get(logInMemberRef);
                if (!logInMemberDoc.exists) {
                    throw new Error('로그가 존재하지 않습니다.(logInMemberDoc)');
                }
                const log = logInMemberDoc.data();

                if (log.uid !== uid) {
                    throw new Error('본인만 취소할 수 있습니다.');
                }
                const logInGameRef = admin.firestore().collection('games').doc(log.gameId).collection('members').doc(logId);
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists) {
                    throw new Error('유저가 존재하지 않습니다.');
                }
                const user = userDoc.data();
                const gameRef = admin.firestore().collection('games').doc(log.gameId);
                const gameDoc = await transaction.get(gameRef);
                if (!gameDoc.exists) {
                    throw new Error('게임이 존재하지 않습니다.');
                }
                const game = gameDoc.data();

                if (game.isOnBetting === false) {
                    throw new Error('배팅이 중지된 게임이라 취소할 수 없습니다.');
                }
                if (game.answer) {
                    throw new Error('이미 정답이 등록되어 취소할 수 없습니다.');
                }
                // const logInMember = logInMemberDoc.data();
                // const logInGame = logInGameDoc.data();

                // if (logInMember.uid !== uid) {
                //     throw new Error('로그가 존재하지 않습니다.');
                // }

                const point = Number(log.bettingPoint);

                user.point =Number(user.point) + point;

                await transaction.update(userRef, user);
                await transaction.delete(logInMemberRef);
                await transaction.delete(logInGameRef);

                myPoint = user.point;
            });
            res.json({
                data: {
                    myPoint,
                }
            });
        } catch(error) {
            res
                .json({
                    data: {
                        isErr: true,
                        message: error.message,
                    }
                });
        }
    });
});

exports.answerSet = seoul.https.onRequest((req, res) => {
    cors(req, res, async ()=>{
        try {
            const { gameId, answer } = req.query;
            if (!gameId || !answer) {
                throw new Error('gameId, answer가 필요합니다.');
            }

            // 요청에서 사용자 ID 토큰 가져오기
            let idToken = req.headers.authorization;
            if (idToken.startsWith('Bearer ')) {
                // Remove Bearer from string
                idToken = idToken.slice(7, idToken.length);
            }
            
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;


            const userRef = admin.firestore().collection('members').doc(uid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                throw new Error('유저가 존재하지 않습니다.');
            }
            const user = userDoc.data();
            const isAdmin = user.isAdmin;
            if (!isAdmin) {
                throw new Error('관리자만 정답을 등록할 수 있습니다.');
            }

            const gameRef = admin.firestore().collection('games').doc(gameId);
            const gameDoc = await gameRef.get();
            if (!gameDoc.exists) {
                throw new Error('게임이 존재하지 않습니다.');
            }
            const game = gameDoc.data();

            if (game.answer) {
                throw new Error('이미 정답이 등록되었습니다.');
            }


            const batch = admin.firestore().batch();


            const logsInGameRef = admin.firestore().collection('games').doc(gameId).collection('members');
            const logsInGame = await logsInGameRef.get();
            if (logsInGame.empty) {
                throw new Error('배팅한 사람들이 존재하지 않습니다.');
            }
            const logs = logsInGame.docs.map(doc => doc.data());
            const totalBettingPoint = logs.reduce((acc, log) => {
                const { bettingPoint = 0 } = log;
                acc += Number(bettingPoint);
                return acc;
            }, 0);

            const logsOfAnswerMember = logs.filter(log => log.selecOption === answer);
            const totalBettingPointOfAnswerMember = logsOfAnswerMember.reduce((acc, log) => {
                const { bettingPoint = 0 } = log;
                acc += Number(bettingPoint);
                return acc;
            }, 0);

            const logId = uuidv4();

            // logsOfAnswerMember.forEach(async (log) => {
            for (const log of logsOfAnswerMember) {
                const memberRef = admin.firestore().collection('members').doc(log.uid);
                const logsInMemberRef = admin.firestore().collection('members').doc(log.uid).collection('games').doc(logId);
                const receivedPoint = Math.floor(log.bettingPoint * totalBettingPoint / totalBettingPointOfAnswerMember);
                
                const memberDoc = await memberRef.get();
                if (!memberDoc.exists) {
                    throw new Error('유저가 존재하지 않습니다.');
                }
                const member = memberDoc.data();
                const point = member.point;

                batch.update(memberRef, {
                    point: point + receivedPoint,
                });

                const receivedLog = {
                    id: logId,
                    receivedPoint,
                    selecOption: log.selecOption,
                    bettingPoint: log.bettingPoint,
                    gameName: log.gameName,
                    userName: log.userName,
                    userPoint: log.userPoint + receivedPoint,
                    gameId: log.gameId,
                    uid: log.uid,
                    createdAt: new Date(),
                };

                batch.set(logsInMemberRef, receivedLog);
            };

            batch.update(gameRef, {
                answer,
                isOnBetting: false,
            });

            await batch.commit();


            res.json({
                data: {
                    answer,
                }
            });

        } catch(error) {
            res
                .json({
                    data: {
                        isErr: true,
                        message: error.message,
                    }
                });
        }
    });
});