const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'logifestival';
const myId = "askjflksdjfkljkfjaslkjflksjafkljasfl2";
const adminId = 'admin_abc';

const myAuth = {uid: myId, email: 'abc@x.com' };
const adminAuth = {uid: adminId, email: 'admin@x.com' };

function getFirestore(auth) {
    return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth }).firestore();
}

describe('firestore 보안규칙 테스트', function() {
    it('회원 정보 정상적으로 1번 생성하기 (일반유저, admin유저)', async function() {
        const db = getFirestore(myAuth);
        const myDoc = db.collection('members').doc(myId);
        const adminDoc = db.collection('members').doc(adminId);
        const doc = await myDoc.get();
        const doc2 = await adminDoc.get();

        if (!doc.exists) {
            await firebase.assertSucceeds(myDoc.set({
                uid: myId,
                isAdmin: false,
                email: myAuth.email,
                name: '테스트',
                photoURL: 'https://lh3.goo',
                point: 1000,
                team: '테스트팀',
            }));   
        }
        if (!doc2.exists) {
            await firebase.assertSucceeds(adminDoc.set({
                uid: adminId,
                isAdmin: true,
                email: adminAuth.email,
                name: 'admin 테스트',
                photoURL: 'https://lh3.goo',
                point: 0,
                team: 'admin팀',
            }));
        }
    });

    it('일반 유저정보 정상적으로 읽기', async function() {
        const db = getFirestore(null);
        const doc = db.collection('members').doc(myId);
        await firebase.assertSucceeds(doc.get());
    });

    it('내 정보 정상적으로 update', async function() {
        const db = getFirestore(myAuth);
        const myDoc = db.collection('members').doc(myId);
        await firebase.assertSucceeds(myDoc.update({
            photoURL: 'https://lh3.goo - update 222',
        }));
    });


    it('내 정보 금지된 정보 update 실패히기', async function() {
        const db = getFirestore(myAuth);
        const myDoc = db.collection('members').doc(myId);
        await firebase.assertFails(myDoc.update({
            uid: '바뀌면 안됨',
        }));
        await firebase.assertFails(myDoc.update({
            isAdmin: true,
        }));
        await firebase.assertFails(myDoc.update({
            point: 100,
        }));
        await firebase.assertFails(myDoc.update({
            team: '바뀌면 안됨 팀',
        }));
    });


    it('admin이 유저 team만 바꾸기', async function() {
        const db = getFirestore(adminAuth);
        const myDoc = db.collection('members').doc(myId);
        await firebase.assertSucceeds(myDoc.update({
            team: '로지팀',
        }));
    });

    it('admin이 유저 바꾸면 안될것들 바꾸기 실패', async function() {
        const db = getFirestore(adminAuth);
        const myDoc = db.collection('members').doc(myId);
        await firebase.assertFails(myDoc.update({
            isAdmin: true,
        }));
        await firebase.assertFails(myDoc.update({
            uid: '바뀌면 안됨',
        }));
        await firebase.assertFails(myDoc.update({
            point: 100,
        }));
    });
});


describe('실제 logibros 세팅', function() {
    const logibros = [
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
    ];
    const members = [];
    let adminAuth = null;
    
    it('회원 정보들 모두 불러오기', async function() {
        const db = getFirestore(null);
        const membersRef = db.collection('members');
        const docs = await membersRef.get();
        docs.forEach((doc) => {
            members.push(doc.data());
        });
    });

    it('회원들 청팀, 백팀 세팅', async function() {
        const admin = members.find((member) => member.isAdmin);
        if (admin ) {
            adminAuth = {uid: admin.uid, email: admin.email };
        }
        if (!adminAuth) {
            throw new Error('admin 정보가 없습니다.');
        }

        const db = getFirestore(adminAuth);
        console.log({
            members,
        });

        const normalMembers = members.filter((member) => !member.isAdmin);
        let index = 0;
        for (member of normalMembers) {
            const doc = db.collection('members').doc(member.uid);
            const team = index % 2 === 0 ? '청팀' : '백팀';
            console.log({
                uid: member.uid,
                team,
                name: logibros[index],
            });
            await firebase.assertSucceeds(doc.update({
                team,
                name: logibros[index],
            }));
            index++;
        }
    });
});