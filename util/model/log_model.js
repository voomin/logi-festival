const { v4: uuidv4 } = require('uuid');

export default class LogModel {
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
            id: logMoel.id,
            selecOption: logMoel.selecOption,
            bettingPoint: Number(logModel.bettingPoint),
            receivedPoint: Number(logModel.receivedPoint),
            teamPoint: Number(logModel.teamPoint),
            userPoint: Number(logModel.userPoint),
            memo: logMoel.memo,
            gameName: logMoel.gameName,
            userName: logMoel.userName,
            gameId: logMoel.gameId,
            uid: logMoel.uid,
            createdAt: logMoel.createdAt,
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