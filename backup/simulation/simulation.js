import Define from './simulation/define.js';
import TeamGame from './simulation/team_game.js';
import SoloGame from './simulation/solo_game.js';
import Member from './member.js';

export default class Simulation {
    _members = [];
    
    _teamGame = new TeamGame();
    _soloGame = new SoloGame();

    get members() { return this._members; }

    constructor() {
        this.reset();
    }

    reset() {
        this._members = [];
        Define.logibros.forEach((name) => {
            this._members.push(new Member(name));
        });

        this.setTeam();
        this.playGames();
    }

    playGames() {
        this._teamGame.play(this._members);
        this._teamGame.play(this._members);
        this._teamGame.play(this._members);
        this._teamGame.play(this._members);

        this._soloGame.play(this._members);
        this._soloGame.play(this._members);
        this._soloGame.play(this._members);
        this._soloGame.play(this._members);
    }

    setTeam() {
        const teamTemp = [
            ...new Array(9).fill(Define.teamNameArr[0]),
            ...new Array(8).fill(Define.teamNameArr[1]),
        ];
        this._members.forEach((logibro) => {
            const randomNum = Math.floor(Math.random() * teamTemp.length);
            const team = teamTemp.splice(randomNum, 1)[0];
            logibro.setTeam(team);
        });
    }

    getMembersInfo() {
        return this._members.map((member) => member.getInfo()).sort((a, b) => {
            return b.point - a.point;
        });
    }
}