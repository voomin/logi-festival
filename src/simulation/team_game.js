import Define from './define.js';

export default class TeamGame {
    constructor() {
        // console.log('팀 게임 생성자');
    }

    getRandomTeam() {
        return Define.teamNameArr[Math.floor(Math.random() * Define.teamNameArr.length)];
    }

    play(members) {
        const winnerTeam = this.getRandomTeam();
        members.forEach((member) => {
            if (member.team === winnerTeam) {
                member.addPoint(Define.teamGame.getPoint);
            }
        });
    }

}