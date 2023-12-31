const { v4: uuidv4 } = require('uuid');

export default class GameModel {
    constructor({
        answer, id, isOnBetting, name, options, createdAt, 
        teamPoint,
    }) {
        this.answer = answer;
        this.id = id;
        this.isOnBetting = isOnBetting;
        this.name = name;
        this.options = options;
        this.createdAt = createdAt;
        this.teamPoint = teamPoint;
    }

    get isActivated() {
        return this.isOnBetting && this.answer === "";
    }

    static toJson(gameModel) {
        return {
            answer: gameModel.answer,
            id: gameModel.id,
            isOnBetting: gameModel.isOnBetting,
            name: gameModel.name,
            options: gameModel.options,
            createdAt: gameModel.createdAt,
            teamPoint: gameModel.teamPoint,
        };
    }

    static createByNameAndOptions(name, options, teamPoint) {
        return {
            id: uuidv4(),
            answer: "",
            isOnBetting: true,
            name: name,
            options: options,
            teamPoint: teamPoint,
            createdAt: new Date(),
        };
    }
}