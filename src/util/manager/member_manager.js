import { collection, getDocs, onSnapshot } from "firebase/firestore";
import Auth from "../../auth";
import MemberModel from "../model/member_model";
import FirebaseManager from "./firebase_manager";
import BettingManager from "./betting_manager";

export default class MemberManager {
    static instance = null;
    static getInstance() {
        if (MemberManager.instance === null) {
            MemberManager.instance = new MemberManager();
        }
        return MemberManager.instance;
    }

    children = [];
    me = null;

    _watching = false;

    constructor() {
        console.log('MemberManager constructor');
        this._watchCollection();
    }

    async _watchCollection() {
        if (this._watching) return;
        this._watching = true;


        await onSnapshot(collection(FirebaseManager.db, "members"), (querySnapshot) => {
            const members = querySnapshot.docs
                .map(doc => new MemberModel(doc.data()))
                .sort((a, b) => b.point - a.point);

            this.children = members;
            const uid = Auth.getInstance().uid;
            if (!uid) return;
            const me = members.find(member => member.uid === uid);
            this.setMe(me);
            MemberManager.meInHtml(me);
            MemberManager.setListInHtml(members);
            console.log('watchCollection', {
                members,
            });
        });
    }

    setMeByUid(uid) {
        const me = this.children.find(member => member.uid === uid);
        if (me) this.setMe(me);
    }

    setMe(member) {
        this.me = new MemberModel(member);
        Auth.signInHtml(this.me);
    }

    static async getLogsByUid(uid) {
        const logInMemberQuerySnapshot = await getDocs(collection(FirebaseManager.db, "members", uid, "games"));
        return logInMemberQuerySnapshot.docs
            .map(doc => doc.data())
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    static setPointInHtml(point) {
        const myPoint = document.getElementById('myPoint');
        myPoint.innerText = point;
    }

    static meInHtml(me) {
        const profileImg = document.getElementById('profile-img');
        const name = document.getElementById('name');
        const email = document.getElementById('email');

        profileImg.src = me.photoURL;
        name.innerText = me.name;
        email.innerText = me.email;

        document.getElementById('memberBox1').style.display = 'block';
        // document.getElementById('memberBox2').style.display = 'block';
        const guestBox = document.getElementById('guestBox');
        guestBox.style.display = 'none';
    }

    static setListInHtml(members) {
        const rankBox = document.getElementById('rankBox');
        const ol = rankBox.querySelector('ol');
        ol.innerHTML = '';
        members.forEach((member, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.classList.add('d-flex');
            li.classList.add('justify-content-between');
            li.classList.add('align-items-center');
            li.innerText = `${index+1}. ${member.name} (${member.point})`;

            const btnGroup = document.createElement('div');
            btnGroup.classList.add('btn-group');
            btnGroup.classList.add('btn-group-sm');
            btnGroup.setAttribute('role', 'group');
            btnGroup.setAttribute('aria-label', 'Basic example');

            const infoButton = document.createElement('button');
            infoButton.classList.add('btn');
            infoButton.classList.add('btn-info');
            infoButton.setAttribute('data-bs-toggle', 'modal');
            infoButton.setAttribute('data-bs-target', '#memberDetailModal');
            infoButton.innerText = '정보보기';
            infoButton.onclick = async () => {
                MemberManager.setDetailModalInHtml(member);
            }

            btnGroup.appendChild(infoButton);
            li.appendChild(btnGroup);



            ol.appendChild(li);
        });
    }

    static async setDetailModalInHtml(member) {
        memberPoint.innerText = `포인트 : ${member.point}`;

        const logs = await MemberManager.getLogsByUid(member.uid);
        console.log({
            logs
        });

        const memberDetailModalBody = document.getElementById('memberDetailModalBody');
        memberDetailModalBody.innerHTML = '';
        const memberDetailModalLabel = document.getElementById('memberDetailModalLabel');
        memberDetailModalLabel.innerText = member.name + ' 정보';

        if (logs.length === 0) {
            const logDoc = document.createElement('div');
            logDoc.classList.add('list-group-item');
            logDoc.innerText = '이력이 없습니다.';
            memberDetailModalBody.appendChild(logDoc);
        }
        
        const logsDoc = document.createElement('ul');
        logsDoc.classList.add('list-group');
        memberDetailModalBody.appendChild(logsDoc);
        logs.forEach((log) => {
            const logDoc = document.createElement('div');
            logDoc.classList.add('list-group-item');
            logDoc.innerText = `${log.gameName}에 '${log.selecOption}'(으)로 ${log.bettingPoint} 배팅했습니다. (남은 포인트 : ${log.userPoint}))`;

            const cancelBettingButton = document.createElement('button');
            cancelBettingButton.classList.add('btn');
            cancelBettingButton.classList.add('btn-sm');
            cancelBettingButton.classList.add('btn-outline-secondary');
            cancelBettingButton.innerText = 'x';
            cancelBettingButton.onclick = async () => {
                const data = await BettingManager.cancel(log.id);
                if (data.isErr) {
                    alert('취소에 실패했습니다. ' + data.message);
                } else {
                    alert('정상적으로 취소되었습니다.');
                }
            }
            logDoc.appendChild(cancelBettingButton);
            logsDoc.appendChild(logDoc);
        });
    }
}