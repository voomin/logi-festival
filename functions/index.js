const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
    origin: true
});

const { v4: uuidv4 } = require('uuid');
const seoul = functions.region('asia-northeast3').runWith({
    maxInstances: 20,
    enforceAppCheck: true,
});

const initPoint = 1000;

const define = {
    teamNames: [
        '청팀',
        '백팀',
    ],
    getBlueTeam() {
        return this.teamNames[0];
    },
    getWhiteTeam() {
        return this.teamNames[1];
    },

    logibrosNames: [
        "노상민",
        "최성환",
        "김효상",
        "김형기",
        "심지훈",
        "김부민",
        "최수연",
        "서반석",
        "정호룡",
        "임종현",
        "박새롬",
        "신병우",
        "이주혁",
        "서유리",
        "이미르",
        "김상현",
        "박수정",
        "조혜선",
        '박관석',
    ]
};

class LogModel {
    constructor({
        id,
        receivedPoint, // 받은 포인트
        bettingPoint, // 베팅 포인트
        teamPoint, // 팀 포인트
        selecOption,
        gameName,
        userName,
        userPoint,
        gameId,
        uid,
        createdAt,
        memo,
    }) {
        this.id = id;
        this.selecOption = selecOption;
        this.bettingPoint = bettingPoint;
        this.receivedPoint = receivedPoint;
        this.memo = memo;
        this.teamPoint = teamPoint;
        this.gameName = gameName;
        this.userName = userName;
        this.userPoint = userPoint;
        this.gameId = gameId;
        this.uid = uid;
        this.createdAt = createdAt;
    }


    static toJson(logModel) {
        return {
            id: logModel.id,
            selecOption: logModel.selecOption,
            bettingPoint: Number(logModel.bettingPoint),
            receivedPoint: Number(logModel.receivedPoint),
            teamPoint: Number(logModel.teamPoint),
            userPoint: Number(logModel.userPoint),
            memo: logModel.memo,
            gameName: logModel.gameName,
            userName: logModel.userName,
            gameId: logModel.gameId,
            uid: logModel.uid,
            createdAt: logModel.createdAt,
        };
    }


    static create({
        id = uuidv4(),
        selecOption = '',
        bettingPoint, 
        receivedPoint, 
        memo = '',
        teamPoint, 
        gameName = '', 
        userName = '', 
        userPoint = 0, 
        gameId = '', 
        uid = '', 
        createdAt = new Date(),
    }) {
        return new LogModel({
            id: id,
            selecOption: selecOption,
            bettingPoint: bettingPoint,
            receivedPoint: receivedPoint,
            memo: memo,
            teamPoint: teamPoint,
            gameName: gameName,
            userName: userName,
            userPoint: userPoint,
            gameId: gameId,
            uid: uid,
            createdAt: createdAt,
        });
    }
}


admin.initializeApp();

exports.welcomeLogibros = seoul.auth.user().onCreate((user) => {
  try {
    const { uid, displayName, email, photoURL } = user;

    // if (email.endsWith('@logibros.com') === false) {
    //     return;
    // }

    const userRef = admin.firestore().collection('members').doc(uid);
    userRef.set({
      uid,
      isAdmin: false,
      name: displayName,
      email,
      photoURL,
      point: initPoint,
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

            const logInMemberRef = admin.firestore().collection('members').doc(uid).collection('logs').doc(logId);
            const logInGameRef = admin.firestore().collection('games').doc(gameId).collection('logs').doc(logId);
            
            let myPoint = 0;
            const numberPoint = Number(point);

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

                if (user.point < numberPoint) {
                    throw new Error('포인트가 부족합니다.');
                }
                
                user.point = Number(user.point) - numberPoint;

                const log = LogModel.create({
                    id: logId,
                    selecOption,
                    bettingPoint: point,
                    gameName: game.name,
                    userName: user.name,
                    userPoint: user.point,
                    gameId,
                    uid,
                });

                await transaction.update(userRef, user);
                await transaction.set(logInMemberRef, LogModel.toJson(log));
                await transaction.set(logInGameRef, LogModel.toJson(log));

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
            const logInMemberRef = admin.firestore().collection('members').doc(uid).collection('logs').doc(logId);
            
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
                const logInGameRef = admin.firestore().collection('games').doc(log.gameId).collection('logs').doc(logId);
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

exports.answerSet = seoul
    .runWith({
        maxInstances: 3,
    })
    .https.onRequest((req, res) => {
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


            const logsInGameRef = admin.firestore().collection('games').doc(gameId).collection('logs');
            const logsInGame = await logsInGameRef.get();
            const logs = logsInGame.docs.map(doc => doc.data());
            const totalBettingPoint = logs.reduce((acc, log) => {
                const { bettingPoint = 0 } = log;
                acc += Number(bettingPoint);
                return acc;
            }, 0);

            const logsOfAnswerMember = logs.filter(log => log.selecOption === answer);
            const receivedPointMap = new Map();
            const totalBettingPointOfAnswerMember = logsOfAnswerMember.reduce((acc, log) => {
                const { bettingPoint = 0, uid } = log;
                receivedPointMap.set(uid, 0);
                acc += Number(bettingPoint);
                return acc;
            }, 0);

            const logId = uuidv4();

            // logsOfAnswerMember.forEach(async (log) => {
            for (const log of logsOfAnswerMember) {
                const memberRef = admin.firestore().collection('members').doc(log.uid);
                const logsInMemberRef = admin.firestore().collection('members').doc(log.uid).collection('logs').doc(logId);
                const numberBettingPoint = Number(log.bettingPoint);
                const numberTotalBettingPointOfAnswerMember = Number(totalBettingPointOfAnswerMember);
                const numberTotalBettingPoint = Number(totalBettingPoint);
                const numberReceivedPoint = Math.floor(numberBettingPoint * numberTotalBettingPoint / numberTotalBettingPointOfAnswerMember);
                
                const memberDoc = await memberRef.get();
                if (!memberDoc.exists) {
                    throw new Error('유저가 존재하지 않습니다.');
                }
                const member = memberDoc.data();
                const numberPoint = Number(member.point || 0);

                const numberBeforeReceivedPoint = Number(receivedPointMap.get(log.uid) || 0);
                receivedPointMap.set(log.uid, 
                    numberBeforeReceivedPoint + numberReceivedPoint);

                batch.update(memberRef, {
                    point: numberPoint + numberReceivedPoint,
                });

                const receivedLog = LogModel.create({
                    id: logId,
                    receivedPoint: numberReceivedPoint,
                    selecOption: log.selecOption,
                    bettingPoint: log.bettingPoint,
                    gameName: log.gameName,
                    userName: log.userName,
                    userPoint: Number(log.userPoint || 0) + numberReceivedPoint,
                    gameId: log.gameId,
                    uid: log.uid,
                });

                batch.set(logsInMemberRef, LogModel.toJson(receivedLog));
            };

            console.log('팀포인트 존재하니?', game.teamPoint);

            if (game.teamPoint) {
                const membersRef = admin.firestore().collection('members');
                const membersSnapshot = await membersRef.get();
                const members = membersSnapshot.docs.map(doc => doc.data());

                if (members.empty) {
                    throw new Error('회원 정보들이 존재하지 않습니다.');
                }

                let winnerTeam = '';
                if (define.teamNames.includes(answer)) {
                    // 팀전
                    winnerTeam = answer;
                } else {
                    // 개인전
                    const winnerMemberName = answer;
                    const winnerMember = members.find(member => member.name === winnerMemberName);
                    if (!winnerMember) {
                        throw new Error(`우승상금 부여할 '${answer}'님의 정보가 존재하지 않습니다.`);
                    }
                    winnerTeam = winnerMember.team;
                }

                if (!winnerTeam) {
                    throw new Error('우승상금 부여할 팀이 존재하지 않습니다.');
                }

                console.log('winnerTeam', winnerTeam);

                for (const member of members) {
                    if (member.team === winnerTeam) {
                        const teamPointLogId = uuidv4();
                        const memberRef = admin.firestore().collection('members').doc(member.uid);
                        const logsInMemberRef = admin.firestore().collection('members').doc(member.uid).collection('logs').doc(teamPointLogId);
                        const receivedPoint = Number(game.teamPoint);
                        const point = Number(member.point) + Number(receivedPointMap.get(member.uid) || 0);

                        batch.update(memberRef, {
                            point: point + receivedPoint,
                        });

                        const receivedLog = LogModel.create({
                            id: teamPointLogId,
                            receivedPoint,
                            selecOption: winnerTeam,
                            bettingPoint: 0,
                            teamPoint: game.teamPoint,
                            gameName: game.name,
                            userName: member.name,
                            userPoint: point + receivedPoint,
                            gameId: game.id,
                            uid: member.uid,
                            createdAt: new Date(),
                        });

                        console.log('receivedLog', JSON.stringify(receivedLog));

                        batch.set(logsInMemberRef, LogModel.toJson(receivedLog));
                    }
                }

            }

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


exports.allClear = seoul
    .runWith({
        maxInstances: 1,
    })
    .https.onRequest((req, res) => {
    cors(req, res, async ()=>{
        try {
            // TODO. admin인지 확인
            let idToken = req.headers.authorization;
            if (idToken.startsWith('Bearer ')) {
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
                throw new Error('관리자가 아닙니다.');
            }

            // TODO. 모든 게임의 isOnBetting을 true로 변경
            // TODO. 모든 게임의 answer를 삭제
            // TODO. 모든 게임의 logs를 삭제
            const gamesRef = admin.firestore().collection('games');
            const gamesSnapshot = await gamesRef.get();
            const games = gamesSnapshot.docs.map(doc => doc.data());
            if (games.empty) {
                throw new Error('게임 정보들이 존재하지 않습니다.');
            }
            const batch = admin.firestore().batch();
            for (const game of games) {
                const gameRef = admin.firestore().collection('games').doc(game.id);
                batch.update(gameRef, {
                    isOnBetting: true,
                    answer: '',
                });

                const logsRef = admin.firestore().collection('games').doc(game.id).collection('logs');
                const logsSnapshot = await logsRef.get();
                const logs = logsSnapshot.docs.map(doc => doc.data());
                if (logs.empty) {
                    continue;
                }
                for (const log of logs) {
                    const logRef = admin.firestore().collection('games').doc(game.id).collection('logs').doc(log.id);
                    batch.delete(logRef);
                }
            }


            // TODO. 모든 회원의 포인트를 1000으로 변경
            // TODO. 모든 회원의 logs를 삭제
            const membersRef = admin.firestore().collection('members');
            const membersSnapshot = await membersRef.get();
            const members = membersSnapshot.docs.map(doc => doc.data());
            if (members.empty) {
                throw new Error('회원 정보들이 존재하지 않습니다.');
            }
            for (const member of members) {
                const memberRef = admin.firestore().collection('members').doc(member.uid);
                batch.update(memberRef, {
                    point: initPoint,
                });

                const logsRef = admin.firestore().collection('members').doc(member.uid).collection('logs');
                const logsSnapshot = await logsRef.get();
                const logs = logsSnapshot.docs.map(doc => doc.data());
                if (logs.empty) {
                    continue;
                }
                for (const log of logs) {
                    const logRef = admin.firestore().collection('members').doc(member.uid).collection('logs').doc(log.id);
                    batch.delete(logRef);
                }
            }

            await batch.commit();

            res.json({
                data: {
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