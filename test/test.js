const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'logifestival';

// firestore port: 8080 사용해야됨

describe('로지 운동회 web', function() {
    it('테스트', function() {
        assert.equal(1, 1);
    });

    it('firestore 규칙 테스트', async function() {
        const db = firebase.initializeTestApp({
            projectId: MY_PROJECT_ID
        }).firestore();
        const testDoc = db
            .collection('members').doc('xxxasdf1dfs');

        await firebase.assertSucceeds(testDoc.set({
            uid: 'xxxasdf1dfs',
            isAdmin: false,
            email: 'a@x.com',
            name: '테스트',
            photoURL: 'https://lh3.goo',
            point: 0,
            team: '홍팀',
        }));

        // await firebase.assertSucceeds(testDoc.update({
        //     // uid: 'xxxasdf1dfs',
        //     // isAdmin: true,
        //     name: '테스트2',
        //     // test: 'test',
        //     // team: '양팀',
        // }));

        await firebase.assertSucceeds(testDoc.get());
    });
});