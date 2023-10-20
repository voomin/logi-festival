import { collection, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import FirebaseManager from "./firebase_manager";
import BettingManager from "./betting_manager";

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
                .map(doc => doc.data());

            console.log({
                games,
            });
            this.children = games;
            GameManager.setListInHtml(games);
        });

    }

    static async getLogsById(id) {
        const logInGameQuerySnapshot = await getDocs(collection(FirebaseManager.db, "games", id, "members"));
        return logInGameQuerySnapshot.docs
            .map(doc => doc.data())
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    static setListInHtml(games) {
        
        const gameListBox = document.getElementById('gameListBox');
        const ul = gameListBox.querySelector('ul');
        ul.innerHTML = '';
        games.forEach((game) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.classList.add('d-flex');
            li.classList.add('justify-content-between');
            li.classList.add('align-items-center');
            li.innerText = game.name;
            ul.appendChild(li);

            const btnGroup = document.createElement('div');
            btnGroup.classList.add('btn-group');
            btnGroup.classList.add('btn-group-sm');
            btnGroup.setAttribute('role', 'group');
            btnGroup.setAttribute('aria-label', 'Basic example');   
            li.appendChild(btnGroup);

            const detailButton = document.createElement('button');
            detailButton.classList.add('btn');
            detailButton.classList.add('btn-info');
            detailButton.setAttribute('data-bs-toggle', 'modal');
            detailButton.setAttribute('data-bs-target', '#gameDetailModal');
            detailButton.innerText = '이력보기';
            detailButton.onclick = async () => {
                const logs = await GameManager.getLogsById(game.id);
                
                const gameDetailModalBody = document.getElementById('gameDetailModalBody');
                gameDetailModalBody.innerHTML = '';
                const gameDetailModalLabel = document.getElementById('gameDetailModalLabel');
                gameDetailModalLabel.innerText = game.name + ' 상세이력';
                
                if (logs.length === 0) {
                    const logDoc = document.createElement('div');
                    logDoc.classList.add('list-group-item');
                    logDoc.innerText = '이력이 없습니다.';
                    gameDetailModalBody.appendChild(logDoc);
                }
                const logsDoc = document.createElement('ul');
                logsDoc.classList.add('list-group');
                gameDetailModalBody.appendChild(logsDoc);
                logs.forEach((log) => {
                    const logDoc = document.createElement('div');
                    logDoc.classList.add('list-group-item');
                    logDoc.innerText = `${log.userName}님이 '${log.selecOption}'에 ${log.bettingPoint} 배팅했습니다.`;
                    logsDoc.appendChild(logDoc);
                });
            }
            btnGroup.appendChild(detailButton);

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
        });
    }
}