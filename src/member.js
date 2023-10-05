import define from "./simulation/define.js";

export default class Member {
    _name = '';
    _team = '';
    _point = 0;

    _logArr = [];


    get name() { return this._name; }
    
    get team() { return this._team; }

    get point() { return this._point; }

    addPoint(point) {
        this._point += point;
    }

    setPoint(point) {
        this._point = point;
    }

    initPoint() {
        this._point = define.player.initPoint;
    }

    setTeam(team) {
        this._team = team;
    }


    constructor(name) {
        this._name = name;
        this.initPoint();
    }

    getInfo() {
        return {
            name: this._name,
            team: this._team,
            point: this._point,
            logs: this._logArr,
        };
    }

}