import Define from './define.js';

export default class SoloGame {
    constructor() {
        // console.log('팀 게임 생성자');
    }

    play(members) {
        const membersTemp = [...members];
        const member1 = membersTemp.splice(Math.floor(Math.random() * membersTemp.length), 1)[0];
        const member2 = membersTemp.splice(Math.floor(Math.random() * membersTemp.length), 1)[0];
        const member3 = membersTemp.splice(Math.floor(Math.random() * membersTemp.length), 1)[0];

        member1.addPoint(Define.soloGame.getPoint.first);
        member2.addPoint(Define.soloGame.getPoint.second);
        member3.addPoint(Define.soloGame.getPoint.third);
    }

}