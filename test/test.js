const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'logifestival';
const myId = "user_abc";
const adminId = 'admin_abc';

const myAuth = {uid: myId, email: 'abc@x.com' };
const adminAuth = {uid: adminId, email: 'admin@x.com' };

function getFirestore(auth) {
    return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth }).firestore();
}

// firestore port: 8080 사용해야됨
describe('로지 운동회 web', function() {
    it('테스트', function() {
        assert.equal(1, 1);
    });

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
                point: 0,
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
            name: '테스트 update 2222',
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
        await firebase.assertFails(myDoc.update({
            name: '바뀌면 안됨 이름',
        }));
    });

});