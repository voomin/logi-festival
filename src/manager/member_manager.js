import { collection, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import Auth from "../auth";
import MemberModel from "../../util/model/member_model";
import FirebaseManager from "./firebase_manager";
import BettingManager from "./betting_manager";
import GameManager from "./game_manager";
import define from "../../util/define";
import LogModel from "../../util/model/log_model";

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

    get isAdmin() {
        return this.me && this.me.isAdmin;
    }

    get myPoint() {
        return this.me && this.me.point;
    }

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

            console.log('watchCollection', {
                members,
            });

            this.children = members;

            const uid = Auth.getInstance().uid;
            if (uid) {
                const me = members.find(member => member.uid === uid);
                if (me) {
                    this.me = new MemberModel(me);
                    Auth.signInHtml(this.me);
                    MemberManager.meInHtml(me);
                    MemberManager.setPointInHtml(me.point);
                    GameManager.setListInHtml(GameManager.getInstance().children);
                }
            }
            MemberManager.setListInHtml(members);
        });
    }

    setMeByUid(uid) {
        const me = this.children.find(member => member.uid === uid);
        if (me) {
            this.me = new MemberModel(me);
        } else {
            console.error('setMeByUid', 'me is null');
        }
    }


    out() {
        this.me = null;
    }

    static async getLogsByUid(uid) {
        const logInMemberQuerySnapshot = await getDocs(collection(FirebaseManager.db, "members", uid, "logs"));
        return logInMemberQuerySnapshot.docs
            .map(doc => new LogModel(doc.data()))
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    async updatePhotoURL(photoURL) {
        try {
            const uid = this.me.uid;

            const memberDocRef = await doc(FirebaseManager.db, "members", uid);
            
            await updateDoc(memberDocRef, {
                photoURL,
            });

            return true;
        } catch (err) {
            console.error(err);
            alert('이미지 변경에 실패했습니다.');
            return false;
        }
    }

    static async updateMember({ uid, name, team }) {
        try {
            const memberDocRef = await doc(FirebaseManager.db, "members", uid);
            
            await updateDoc(memberDocRef, {
                name,
                team,
            });

            return true;
        } catch (err) {
            console.error(err);
            alert('팀 변경에 실패했습니다.');
            return false;
        }
    }

    static setPointInHtml(point) {
        const myPoint = document.getElementById('myPoint');
        const memberPoint = document.getElementById('memberPoint');
        memberPoint.innerText = point;
        myPoint.innerText = point;
    }

    static meInHtml(me) {
        if (!me) return;
        const profileImg = document.getElementById('profile-img');
        const profileImg2 = document.getElementById('profile-img2');
        const photoUrlInput = document.getElementById('photoUrlInput');
        const name = document.getElementById('name');
        const email = document.getElementById('email');

        profileImg.src = me.photoURL;
        profileImg2.src = me.photoURL;
        name.innerText = me.name;
        email.innerText = me.email;
        photoUrlInput.value = me.photoURL;

        document.getElementById('memberBox1').style.display = 'block';
        // document.getElementById('memberBox2').style.display = 'block';
        const guestBox = document.getElementById('guestBox');
        guestBox.style.display = 'none';

        if (MemberManager.getInstance().isAdmin) {
            const gameCreateButton = document.getElementById('gameCreateButton');
            gameCreateButton.style.display = 'inline-block';

            const allClearButton = document.getElementById('allClearButton');
            allClearButton.style.display = 'inline-block';
        }
    }

    static setListInHtml(members) {
        const rankBox = document.getElementById('rankBox');
        const ol = rankBox.querySelector('ol');
        ol.innerHTML = '';

        let blueTeamTotalPoint = 0;
        let whiteTeamTotalPoint = 0;
        let blutTeamCount = 0;
        let whiteTeamCount = 0;

        members.forEach((member, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.classList.add('d-flex');
            li.classList.add('justify-content-between');
            li.classList.add('align-items-center');


            const textGroup = document.createElement('div');
            textGroup.classList.add('text-start');
            textGroup.classList.add('d-flex');
            textGroup.classList.add('align-items-center');


            li.appendChild(textGroup);
            
            const number = document.createElement('span');
            number.innerText = `${index+1}.`;
            textGroup.appendChild(number);

            const teamDoc = document.createElement('span');
            teamDoc.classList.add('badge');
            if (member.team === define.getBlueTeam()) {
                teamDoc.classList.add('bg-primary');
                blueTeamTotalPoint += member.point;
                blutTeamCount++;
            } else if (member.team === define.getWhiteTeam()){
                teamDoc.classList.add('text-bg-light');
                whiteTeamTotalPoint += member.point;
                whiteTeamCount++;
            } else {
                teamDoc.classList.add('text-bg-warning');
            }
            teamDoc.classList.add('rounded-pill');
            teamDoc.classList.add('mx-2');
            teamDoc.innerText = member.team || '??';
            textGroup.appendChild(teamDoc);

            const image = document.createElement('img');
            image.src = member.photoURL;
            image.classList.add('rounded-circle');
            image.classList.add('me-2');
            image.classList.add('d-none');
            image.classList.add('d-sm-block');
            image.width = 32;
            image.height = 32;
            textGroup.appendChild(image);

            const mainText = document.createElement('p');
            mainText.classList.add('mb-1');
            mainText.innerText = `${member.name}  ${member.point}p`;
            textGroup.appendChild(mainText)

            // const subText = document.createElement('small');
            // subText.classList.add('text-muted');
            // subText.innerText = member.email;;
            // textGroup.appendChild(subText);



            const btnGroup = document.createElement('div');
            btnGroup.classList.add('btn-group');
            btnGroup.classList.add('btn-group-sm');
            btnGroup.setAttribute('role', 'group');
            btnGroup.setAttribute('aria-label', 'Basic example');

            const adminButton = document.createElement('button');
            adminButton.classList.add('btn');
            adminButton.classList.add('btn-warning');
            adminButton.setAttribute('data-bs-toggle', 'modal');
            adminButton.setAttribute('data-bs-target', '#memberAdminModal');
            adminButton.innerText = '관리';
            adminButton.onclick = async () => {
                const memberAdminModalLabel = document.getElementById('memberAdminModalLabel');
                memberAdminModalLabel.innerText = member.name + ' 관리';

                const memberAdminModalEmail = document.getElementById('memberAdminModalEmail');
                memberAdminModalEmail.innerText = member.email;
                
                const memberAdminModalSubmitButton = document.getElementById('memberAdminModalSubmitButton');

                const memberNameSelect = document.getElementById('memberNameSelect');
                // selected 해놓기
                const option = memberNameSelect.querySelector('option[value="' + member.name + '"]');
                if (option) {
                    option.selected = true;
                } else {
                    const firstOption = memberNameSelect.querySelector('option');
                    firstOption.selected = true;
                }

                const curentTeam = member.team;
                const blueTeamRadio = document.getElementById('memberTeamSelect1');
                const whiteTeamRadio = document.getElementById('memberTeamSelect2');
                if (curentTeam === define.getBlueTeam()) {
                    blueTeamRadio.checked = true;
                } else if (curentTeam === define.getWhiteTeam()) {
                    whiteTeamRadio.checked = true;
                } else {
                    blueTeamRadio.checked = false;
                    whiteTeamRadio.checked = false;
                }


                memberAdminModalSubmitButton.onclick = async () => {
                    const memberName = memberNameSelect.options[memberNameSelect.selectedIndex].value;
                    if (!memberName) {
                        alert('이름을 선택해주세요.');
                        return;
                    }
                    const team = document.querySelector('input[name="team"]:checked');
                    if (!team) {
                        alert('팀을 선택해주세요.');
                        return;
                    }

                    if (
                        memberName === member.name &&
                        team.value === member.team
                    ) {
                        alert('변경된 내용이 없습니다.');
                        return;
                    }

                    const memberAdminModalSpinner = document.getElementById('memberAdminModalSubmitButtonSpinner');
                    memberAdminModalSpinner.style.display = 'inline-block';
                    memberAdminModalSubmitButton.style.display = 'none';

                    const result = await MemberManager.updateMember({
                        uid: member.uid, 
                        team: team.value,
                        name: memberName,
                    });
                    if (result) {
                        alert('정상적으로 변경되었습니다.');
                    }
                    memberAdminModalSpinner.style.display = 'none';
                    memberAdminModalSubmitButton.style.display = 'inline-block';
                }
            };

            if (MemberManager.getInstance().isAdmin ) {
                btnGroup.appendChild(adminButton);
            }

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

        const blueTemaProgress = document.getElementById('blueTemaProgress');
        const whiteTemaProgress = document.getElementById('whiteTemaProgress');
        const blueTemaProgressText = document.getElementById('blueTemaProgressText');
        const whiteTemaProgressText = document.getElementById('whiteTemaProgressText');

        try {
            if (blueTeamTotalPoint + whiteTeamTotalPoint <= 0) {
                throw new Error('포인트가 없습니다.');
            }
            const blueTeamAveragePoint = Math.floor(blueTeamTotalPoint / blutTeamCount);
            const whiteTeamAveragePoint = Math.floor(whiteTeamTotalPoint / whiteTeamCount);
            const blueTemaProgressPercent = Math.floor(blueTeamAveragePoint / (blueTeamAveragePoint + whiteTeamAveragePoint) * 100);
            const whiteTemaProgressPercent = Math.floor(whiteTeamAveragePoint / (blueTeamAveragePoint + whiteTeamAveragePoint) * 100);

            // const blueTemaProgressPercent = Math.floor(blueTeamTotalPoint / (blueTeamTotalPoint + whiteTeamTotalPoint) * 100);
            // const whiteTemaProgressPercent = Math.floor(whiteTeamTotalPoint / (blueTeamTotalPoint + whiteTeamTotalPoint) * 100);
            blueTemaProgress.style.width = blueTemaProgressPercent + '%';
            whiteTemaProgress.style.width = whiteTemaProgressPercent + '%';
            blueTemaProgressText.innerText = blueTemaProgressPercent + '%' + ' (≈' + blueTeamAveragePoint + 'p)';
            whiteTemaProgressText.innerText = whiteTemaProgressPercent + '%' + ' (≈' + whiteTeamAveragePoint + 'p)';
            
        } catch(err) {
            blueTemaProgress.style.width = 50 + '%';
            whiteTemaProgress.style.width = 50 + '%';
            blueTemaProgressText.innerText = "푸른 눈의 청룡";
            whiteTemaProgressText.innerText = "백색 눈의 호룡";
        }
        

    }

    static async setDetailModalInHtml(member) {
        memberEmail.innerText = `${member.email}`;
        memberPoint.innerText = `${member.point}`;

        const spiner = document.getElementById('memberDetailModalSpinner');
        spiner.style.display = 'inline-block';
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
        
        const games = GameManager.getInstance().children;
        const logsDoc = document.createElement('ul');
        logsDoc.classList.add('list-group');
        memberDetailModalBody.appendChild(logsDoc);
        logs.forEach((log) => {
            // list tile
            const logDoc = document.createElement('div');
            logDoc.classList.add('list-group-item');
            logDoc.classList.add('d-flex');
            logDoc.classList.add('justify-content-between');
            logDoc.classList.add('align-items-center');
            // id 부여
            logDoc.id = log.id;

            const textGroup = document.createElement('div');
            textGroup.classList.add('text-start');
            logDoc.appendChild(textGroup);

            const mainText = document.createElement('p');
            mainText.classList.add('mb-1');

            if (log.teamPoint) {
                mainText.innerText = `${log.gameName}에서 팀의 승리로 ${log.receivedPoint} 포인트를 받았습니다.`;
                logDoc.classList.add('list-group-item-primary');
            } else if (log.receivedPoint) {
                mainText.innerText = `${log.gameName}에서 ${log.selecOption}(으)로 ${log.bettingPoint} 배팅하여 ${log.receivedPoint} 포인트를 받았습니다.`;
                logDoc.classList.add('list-group-item-success');
            } else {
                mainText.innerText = log.gameName + '에 ' + log.selecOption + '(으)로 ' + log.bettingPoint + ' 배팅했습니다.';
            }
            textGroup.appendChild(mainText);

            const subText1 = document.createElement('small');
            subText1.innerText = '남은 포인트 : ' + log.userPoint;
            // const subText2 = document.createElement('small');
            // subText2.innerText = new Date(log.createdAt).toLocaleString();
            textGroup.appendChild(subText1);
            // textGroup.appendChild(subText2);

            const spiner = document.createElement('span');
            spiner.classList.add('spinner-border');
            spiner.classList.add('spinner-border-sm');
            spiner.setAttribute('role', 'status');
            spiner.setAttribute('aria-hidden', 'true');
            spiner.style.display = 'none';
            logDoc.appendChild(spiner);

            const cancelBettingButton = document.createElement('button');
            cancelBettingButton.classList.add('btn');
            cancelBettingButton.classList.add('btn-sm');
            cancelBettingButton.classList.add('btn-outline-danger');
            cancelBettingButton.innerText = '취소';
            cancelBettingButton.onclick = async () => {
                spiner.style.display = 'inline-block';
                cancelBettingButton.style.display = 'none';

                const data = await BettingManager.cancel(log.id);
                if (data.isErr) {
                    alert('취소에 실패했습니다. ' + data.message);
                } else {
                    alert('정상적으로 취소되었습니다.');
                    const logDoc = document.getElementById(log.id);
                    logDoc.remove();
                }
                spiner.style.display = 'none';
                cancelBettingButton.style.display = 'inline-block';
            }
            // 본인만 취소할 수 있도록
            if (Auth.getInstance().uid !== log.uid || log.receivedPoint) {
                cancelBettingButton.style.display = 'none';
            }
            // 게임이 종료됬거나, 배팅제한인 경우 취소 불가
            const game = games.find(game => game.id === log.gameId);
            if (!game.isActivated) {
                cancelBettingButton.style.display = 'none';
            }
            
            logDoc.appendChild(cancelBettingButton);
            logsDoc.appendChild(logDoc);
        });

        spiner.style.display = 'none';
    }
}