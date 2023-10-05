const initPoint = 1000; // 초기 포인트
const teamPoint = 5000; // 팀전 우승시 +
const 개인전1등 = 3000; // 개인전 우승시 +
const 개인전2등 = 2000;
const 개인전3등 = 1000;
const teamArr = ['청팀', '백팀'];
const 팀배팅율 = 1.3;
const 개인전배팅율 = 2;
const 개인전배팅참여율 = .5;
const logibros = [
    {
        name: '노상민',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '최성환',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '김효상',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '김형기',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '심지훈',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '김부민',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '최수연',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '서반석',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '정호룡',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '임종현',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '박새롬',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '신병우',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '이주혁',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '서유리',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '이미르',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '김상현',
        team: null,
        point: initPoint,
        logs: []
    }, {
        name: '박수정',
        team: null,
        point: initPoint,
        logs: []
    }
];
const gameArr = [
    {
        ty: 'team', name: '줄다리기' },
    {
        ty: 'team', name: '피구' },
    {
        ty: 'team', name: '발야구' },
    {
        ty: 'team', name: '계주달리기' },

    {
        ty: '개인전', name: '신발던지기' },
    {
        ty: '개인전', name: '알까기' },
    {
        ty: '개인전', name: '딱지치기' },
    {
        ty: '개인전', name: '다트' },
]


function getRandomTeam() {
return teamArr[Math.floor(Math.random() * teamArr.length)];
}

// TODO1. 팀을 나눈다.
function setTeam() {
const teamTemp = [
    ...new Array(9).fill(teamArr[0]),
    ...new Array(8).fill(teamArr[1]),
];
logibros.forEach((logibro) => {
    const randomNum = Math.floor(Math.random() * teamTemp.length);
    logibro.team = teamTemp.splice(randomNum, 1)[0];
});
}

function teamBeting(winnerTeam, isShowLog = false) {
logibros.forEach((logibro) => {
    const betPoint = Math.floor(Math.random() * logibro.point);
    const betTeam = getRandomTeam();
    if (isShowLog) {
        addLog(`${logibro.name}이 ${betPoint}점을 ${betTeam}팀에 배팅하였습니다.`);
    }
    if (logibro.team !== winnerTeam) {
        logibro.point -= betPoint;
        logibro.logs.push({
            game: '팀 beting',
            point: -betPoint,
        });
    } else if (logibro.team === winnerTeam) {
        logibro.point += betPoint * 팀배팅율;
        logibro.logs.push({
            game: '팀 beting',
            point: betPoint * 팀배팅율,
        });
    }
});
}   

function 개인전Beting(isShowLog = false) {
logibros.forEach((logibro) => {
    if (Math.random() > 개인전배팅참여율) {
        return;
    }
    const betPoint = Math.floor(Math.random() * logibro.point);
    const betLogibro = logibros[Math.floor(Math.random() * logibros.length)];
    if (isShowLog) {
        addLog(`${logibro.name}이 ${betPoint}점을 ${betLogibro.name}에 배팅하였습니다.`);
    }
    if (logibro === betLogibro) {
        logibro.point += betPoint * 개인전배팅율;
        logibro.logs.push({
            game: '개인전 beting',
            point: betPoint * 개인전배팅율,
        });
    } else {
        logibro.point -= betPoint;
        logibro.logs.push({
            game: '개인전 beting',
            point: -betPoint,
        });
    }
});
}

// TODO2. 1운동회를 시작한다.
function startGame(isShowLog = false) {
gameArr.forEach((game) => {
    if (game.ty === 'team') {
        const team = getRandomTeam();
        const teamMembers = logibros.filter((logibro) => logibro.team === team);
        teamMembers.forEach((logibro) => {
            logibro.point += teamPoint;
            logibro.logs.push({
                game: game.name,
                point: teamPoint,
            });
        });

        teamBeting(team, isShowLog);

        if (isShowLog) {
            addLog(`${game.name}에서 ${team}팀이 우승하였습니다.`);
        }
    } else if (game.ty === '개인전') {
        const logiTemp = [...logibros];
        const logi1 = logiTemp.splice(Math.floor(Math.random() * logiTemp.length), 1)[0];
        const logi2 = logiTemp.splice(Math.floor(Math.random() * logiTemp.length), 1)[0];
        const logi3 = logiTemp.splice(Math.floor(Math.random() * logiTemp.length), 1)[0];
        logi1.point += 개인전1등;
        logi2.point += 개인전2등;
        logi3.point += 개인전3등;
        logi1.logs.push({
            game: game.name,
            point: 개인전1등,
        });
        logi2.logs.push({
            game: game.name,
            point: 개인전2등,
        });
        logi3.logs.push({
            game: game.name,
            point: 개인전3등,
        });

        개인전Beting(isShowLog);


        if (isShowLog) {
            addLog(`${game.name}에서 ${logi1.name}이 1등, ${logi2.name}이 2등, ${logi3.name}이 3등입니다.`);
        }
    }
});
if (isShowLog) {
    addLog('\n');
}
}

function resetPoint() {
logibros.forEach((logibro) => {
    logibro.point = 0;
    logibro.logs = [];
});
}

// TODO3. 점수를 통계내어 출력한다.
function printScore() {
logibros
.sort((a, b) => b.point - a.point)
.forEach((logibro) => {
    addLog(`(${logibro.team}) ${logibro.name}: ${logibro.point}`);
});
addLog('\n');
}

function printTeam() {
teamArr.forEach((team) => {
    addLog(`팀: ${team}, 인원수: ${logibros.filter((logibro) => logibro.team === team).length}`);
    addLog(`구성원: ${logibros.filter((logibro) => logibro.team === team).map((logibro) => logibro.name).join(', ')}`);
});
addLog('\n');
}

function printLogibrosDetail() {
logibros.forEach((logibro) => {
    addLog(`${logibro.name}: ${logibro.point}`);
    addLog(logibro.logs.map((log) => `${log.game}: ${log.point}`).join(', '));
});
}

function addLog(text) {
    document.getElementById('logs').value += text + '\n';
}
