import { httpsCallableFromURL } from "firebase/functions";
import MemberManager from "./member_manager";
import FirebaseManager from "./firebase_manager";
import { doc, updateDoc } from "firebase/firestore";

export default class BettingManager {
    static instance = null;
    static getInstance() {
        if (BettingManager.instance === null) {
            BettingManager.instance = new BettingManager();
        }
        return BettingManager.instance;
    }

    constructor() {
        
    }

    static go(gameId, selecOption, point) {
        return new Promise((resolve, reject) => {
            const functionName = 'betting';
            const queryParameters = {
                selecOption,
                point,
                gameId,
            };
            const queryString = Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&');
            // const baseUrl = 'https://asia-northeast3-logifestival.cloudfunctions.net';
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

    static cancel(logId) {
        return new Promise((resolve, reject) => {
            const functionName = 'cancelBet';
            const queryParameters = {
                logId,
            };
            const queryString = Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&');
            // const baseUrl = 'https://asia-northeast3-logifestival.cloudfunctions.net';
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

    static async updateIsOnBettingById(id, bool) {
        try {
            const gameRef = await doc(FirebaseManager.db, "games", id);
            await updateDoc(gameRef, {
                isOnBetting: bool,
            });

            if (bool) {
                alert('배팅을 허용 시켰습니다.');
            } else {
                alert('배팅을 중지 시켰습니다.');
            }
            return true;
        } catch(err) {
            console.error(err);
            alert('배팅제한 값 업데이트 하는데 실패했습니다.');
            return false;
        }

    }

    static async setModalInHtml(game) {
        const label = document.getElementById('bettingModalLabel');
        label.innerText = game.name + ' 배팅';
        const bettingTeamBox = document.getElementById('bettingTeamBox');
        bettingTeamBox.innerHTML = '';

        const bettingOptions = document.createElement('div');
        bettingOptions.id = 'bettingOptions';
        bettingTeamBox.appendChild(bettingOptions);

        game.options.forEach((option) => {
            const formCheck = document.createElement('div');
            formCheck.classList.add('form-check');
            const formCheckInput = document.createElement('input');
            formCheckInput.classList.add('form-check-input');
            formCheckInput.type = 'radio';
            formCheckInput.name = 'betting';
            formCheckInput.value = option;
            formCheckInput.id = option;
            formCheck.appendChild(formCheckInput);
            const formCheckLabel = document.createElement('label');
            formCheckLabel.classList.add('form-check-label');
            formCheckLabel.setAttribute('for', option);
            formCheckLabel.innerText = option;
            formCheck.appendChild(formCheckLabel);
        
            bettingOptions.appendChild(formCheck);
        });

        const pointInput = document.getElementById('pointInput');
        const submitButton = document.getElementById('bettingSubmitButton');
        submitButton.onclick = async () => {
            const spinner = document.getElementById('bettingSubmitSpinner');
            const selectOptionDoc = document.querySelector('input[name="betting"]:checked');
            let selectOption = '';
            if (selectOptionDoc) {
                selectOption = selectOptionDoc.value;
            } else {
                alert('옵션을 선택해주세요.');
                return;
            }
            if (pointInput.value === '') {
                alert('포인트를 입력해주세요.');
                return;
            }

            spinner.style.display = 'inline-block';
            submitButton.style.display = 'none';

            try {
                const data = await BettingManager.go(
                    game.id,
                    selectOption, 
                    pointInput.value,
                );
                if (data.isErr) {
                    alert('배팅에 실패했습니다. ' + data.message);
                } else {
                    MemberManager.setPointInHtml(data.myPoint);
                    alert('정상적으로 배팅 완료되었습니다.')
                }
            } catch(err) {
                alert('서버에 문제가 생겼습니다. [setModalInHtml] ' + err.message);
            }

            spinner.style.display = 'none';
            submitButton.style.display = 'inline-block';

        } 
    }
}