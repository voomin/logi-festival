import { collection, doc, getDoc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import FirebaseManager from "./firebase_manager";
import BettingManager from "./betting_manager";
import GameModel from "../model/game_model";
import { httpsCallableFromURL } from "firebase/functions";
import MemberManager from "./member_manager";

export default class GameManager{
    static instance = null;
    static getInstance() {
        if (GameManager.instance === null) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    children = [];

    constructor() {
        this._watchCollection();
    }

    async _watchCollection() {
        if (this._watching) return;
        this._watching = true;
        
        await onSnapshot(collection(FirebaseManager.db, "games"), (querySnapshot) => {
            const games = querySnapshot.docs
                .map(doc => new GameModel(doc.data()))
                .sort((a, b) => b.createdAt - a.createdAt);

            console.log({
                games,
            });
            this.children = games;
            GameManager.setListInHtml(games);
        });

    }

    static answerSet(id, answer) {
        return new Promise((resolve, reject) => {
            const functionName = 'answerSet';
            const queryParameters = {
                gameId: id,
                answer
            };
            const queryString = Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&');
            const baseUrl = FirebaseManager.functionsApiUrl;
            const functionUrl = `${baseUrl}/${functionName}?${queryString}`;
            
            httpsCallableFromURL(
                FirebaseManager.functions, 
                functionUrl,
            )()
                .then((result) => {
                    // // Read result of the Cloud Function.
                    // /** @type {any} */
                    // const data = result.data;
                    // const sanitizedMessage = data.text;
                    console.log({
                        result,
                    });
                    resolve(result.data);
                }).catch(err => {
                    console.log({
                        err,
                        // code,
                        // message,
                        // details,
                    });
                    resolve(err.data);
                })
        });
        
    }

    static async teamAdd(title) {
        await GameManager.add(
            GameModel.createByNameAndOptions(title, [
                '청팀', '백팀'
            ]),
        );
    }

    static async logibrosAdd(title) {
        await GameManager.add(
            GameModel.createByNameAndOptions(title, [
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
            ]),
        );
    }

    static async add(game) {
        if (MemberManager.getInstance().isAdmin === false) {
            alert('관리자만 게임을 생성할 수 있습니다.');
            return;
        }
        try {
            const json = GameModel.toJson(game);
            await setDoc(doc(FirebaseManager.db, "games", game.id), json);
            alert('게임 생성에 성공했습니다.');
        } catch(err) {
            console.error(err);
            alert('게임 생성에 실패했습니다.');
        } finally {
        }
    }

    static async getLogsById(id) {
        const logInGameQuerySnapshot = await getDocs(collection(FirebaseManager.db, "games", id, "members"));
        return logInGameQuerySnapshot.docs
            .map(doc => doc.data())
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    static setListInHtml(games) {
        const gameListBox = document.getElementById('gameListBox');
        const gameListEmpty = document.getElementById('gameListEmpty');
        gameListEmpty.style.display = 'none';
        const ul = gameListBox.querySelector('ul');
        ul.innerHTML = '';
        games.forEach((game) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.classList.add('d-flex');
            li.classList.add('justify-content-between');
            li.classList.add('align-items-center');
            const name = document.createElement('span');

            if (game.isActivated) {
                // li.classList.add('list-group-item-success');
            } else {
                li.classList.add('game-not-activated');
                li.classList.add('list-group-item-secondary');
                name.classList.add('text-muted');

            }
            name.innerText = game.name;
            li.appendChild(name);
            ul.appendChild(li);

            const btnGroup = document.createElement('div');
            btnGroup.classList.add('btn-group');
            btnGroup.classList.add('btn-group-sm');
            btnGroup.setAttribute('role', 'group');
            btnGroup.setAttribute('aria-label', 'Basic example');   
            li.appendChild(btnGroup);

            const adminButton = document.createElement('button');
            // gameAdminModal 열기
            adminButton.classList.add('btn');
            adminButton.classList.add('btn-warning');
            adminButton.setAttribute('data-bs-toggle', 'modal');
            adminButton.setAttribute('data-bs-target', '#gameAdminModal');
            adminButton.innerText = '관리';
            adminButton.onclick = () => {
                const label = document.getElementById('gameAdminModalLabel');
                label.innerText = game.name + ' 관리';

                const answerSetButton = document.getElementById('answerSetButton');
                answerSetButton.onclick = async () => {
                    if (game.answer) {
                        alert('이미 정답이 설정되었습니다.');
                        return;
                    }
                    const selectOptionDoc = document.querySelector('input[name="answer"]:checked');
                    if (!selectOptionDoc) {
                        alert('정답을 선택해주세요.');
                        return;
                    }
                    const answer = selectOptionDoc.value;
                    const spiner = document.getElementById('answerSetButtonSpinner');
                    spiner.style.display = 'inline-block';
                    answerSetButton.style.display = 'none';
                    const result = await GameManager.answerSet(game.id, answer) || { isErr: true, message: '응답이 없습니다.' };
                    if (result.isErr) {
                        alert('정답 설정에 실패했습니다. ' + result.message);
                    } else {
                        alert('정답 설정에 성공했습니다.');
                    }
                    spiner.style.display = 'none';
                    answerSetButton.style.display = 'inline-block';

                };

                const adminAnswerBox = document.getElementById('adminAnswerBox');
                adminAnswerBox.innerHTML = '';
                game.options.forEach((option) => {
                    const formCheck = document.createElement('div');
                    formCheck.classList.add('form-check');
                    const formCheckInput = document.createElement('input');
                    formCheckInput.classList.add('form-check-input');
                    formCheckInput.type = 'radio';
                    formCheckInput.name = 'answer';
                    formCheckInput.value = option;
                    formCheckInput.id = option;
                    formCheck.appendChild(formCheckInput);
                    const formCheckLabel = document.createElement('label');
                    formCheckLabel.classList.add('form-check-label');
                    formCheckLabel.setAttribute('for', option);
                    formCheckLabel.innerText = option;
                    formCheck.appendChild(formCheckLabel);
                    adminAnswerBox.appendChild(formCheck);
                });
                

                const unlockButton = document.getElementById('bettingUnlockButton');
                const lockButton = document.getElementById('bettingLockButton');
                unlockButton.style.display = 'inline-block';
                lockButton.style.display = 'inline-block';

                if (game.isOnBetting) {
                    unlockButton.style.display = 'none';
                } else {
                    lockButton.style.display = 'none';
                }

                lockButton.onclick = async () => {
                    const spinner = document.getElementById('bettinglockButtonSpinner');
                    spinner.style.display = 'inline-block';
                    lockButton.style.display = 'none';
                    const isSuccess = await BettingManager.updateIsOnBettingById(game.id, false);
                    spinner.style.display = 'none';
                    if (isSuccess) {
                        game.isOnBetting = false;
                        unlockButton.style.display = 'inline-block';
                    } else {
                        lockButton.style.display = 'inline-block';
                    }
                };

                unlockButton.onclick = async () => {
                    const spinner = document.getElementById('bettinglockButtonSpinner');
                    spinner.style.display = 'inline-block';
                    unlockButton.style.display = 'none';
                    const isSuccess = await BettingManager.updateIsOnBettingById(game.id, true);
                    spinner.style.display = 'none';
                    if (isSuccess) {
                        game.isOnBetting = true;
                        lockButton.style.display = 'inline-block';
                    } else {
                        unlockButton.style.display = 'inline-block';
                    }
                }
            };

            if (MemberManager.getInstance().isAdmin) {
                btnGroup.appendChild(adminButton);
            }

            const detailButton = document.createElement('button');
            detailButton.classList.add('btn');
            detailButton.classList.add('btn-info');
            detailButton.setAttribute('data-bs-toggle', 'modal');
            detailButton.setAttribute('data-bs-target', '#gameDetailModal');
            detailButton.innerText = '이력보기';
            detailButton.onclick = async () => {
                const spiner = document.getElementById('gameDetailModalSpinner');
                spiner.style.display = 'inline-block';

                const gameDetailTotalPoint = document.getElementById('gameDetailTotalPoint');
                gameDetailTotalPoint.innerText = '';

                const logs = await GameManager.getLogsById(game.id);
                
                const gameDetailModalBody = document.getElementById('gameDetailModalBody');
                gameDetailModalBody.innerHTML = '';
                const gameDetailModalLabel = document.getElementById('gameDetailModalLabel');
                gameDetailModalLabel.innerText = game.name + ' 상세이력';

                const gameDetailAnswer = document.getElementById('gameDetailAnswer');
                gameDetailAnswer.style.display = 'none';
                if (game.answer) {
                    gameDetailAnswer.style.display = 'inline-block';
                    gameDetailAnswer.innerText = `정답: ${game.answer}`;
                }
                
                if (logs.length === 0) {
                    const logDoc = document.createElement('div');
                    logDoc.classList.add('list-group-item');
                    logDoc.innerText = '이력이 없습니다.';
                    gameDetailModalBody.appendChild(logDoc);
                }
                let totalPoint = 0;
                const logsDoc = document.createElement('ul');
                logsDoc.classList.add('list-group');
                gameDetailModalBody.appendChild(logsDoc);
                logs.forEach((log) => {
                    const logDoc = document.createElement('div');
                    logDoc.classList.add('list-group-item');
                    logDoc.innerText = `${log.userName}님이 '${log.selecOption}'에 ${log.bettingPoint} 배팅했습니다.`;
                    logsDoc.appendChild(logDoc);
                    totalPoint += Number(log.bettingPoint);
                });

                gameDetailTotalPoint.innerText = `총 배팅 포인트: ${totalPoint}`;

                

                spiner.style.display = 'none';
            }
            btnGroup.appendChild(detailButton);

            if (
                game.isActivated
                && MemberManager.getInstance().me
            ) {
                const bettingButton = document.createElement('button');
                bettingButton.classList.add('btn');
                bettingButton.classList.add('btn-primary');
                // class="btn btn-info" data-bs-toggle="modal" data-bs-target="#bettingModal"
                bettingButton.setAttribute('data-bs-toggle', 'modal');
                bettingButton.setAttribute('data-bs-target', '#bettingModal');

                bettingButton.innerText = '배팅하기';
                bettingButton.onclick = () => {
                    BettingManager.setModalInHtml(game);
                }
                btnGroup.appendChild(bettingButton);
            }
        });

        // 보여줄 게임이 없으면
        if (games.filter((game) => game.isActivated).length === 0) {
            gameListEmpty.style.display = 'block';
        }

        // game-not-activated 가리기
        const gameNotActivated = document.querySelectorAll('.game-not-activated');
        console.log({
            gameNotActivated,
        });
        gameNotActivated.forEach((game) => {
            game.classList.add('d-none');
        });

    }

    static allView() {
        const gameSimpleViewButton = document.getElementById('gameSimpleViewButton');
        const gameAllViewButton = document.getElementById('gameAllViewButton');
        gameSimpleViewButton.style.display = 'inline-block';
        gameAllViewButton.style.display = 'none';
        const gameNotActivated = document.querySelectorAll('.game-not-activated');
        gameNotActivated.forEach((game) => {
            game.classList.remove('d-none');
        });
    }

    static onlyActivatedView() {
        const gameSimpleViewButton = document.getElementById('gameSimpleViewButton');
        const gameAllViewButton = document.getElementById('gameAllViewButton');
        gameSimpleViewButton.style.display = 'none';
        gameAllViewButton.style.display = 'inline-block';

        const gameNotActivated = document.querySelectorAll('.game-not-activated');
        gameNotActivated.forEach((game) => {
            game.classList.add('d-none');
        });
    }
}