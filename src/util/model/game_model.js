export default class GameModel {
    constructor({
        answer, id, isOnBetting, name, options
    }) {
        this.answer = answer;
        this.id = id;
        this.isOnBetting = isOnBetting;
        this.name = name;
        this.options = options;
    }
}