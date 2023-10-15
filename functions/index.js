const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
    origin: true
});

admin.initializeApp();

exports.helloWorld = functions
    .region('asia-northeast3')
    .https.onRequest((req, res) => {
    cors(req, res, async ()=>{
        try {
            const text = req.query.text || "default text";

            const documentId = 'your-document-id'; // 업데이트할 Firestore 문서의 ID
            const newData = {
                // 업데이트할 데이터 필드 및 값
                field1: 'new-value-1',
                field2: 'new-value-2',
                text,
            };

            const documentRef = admin.firestore()
                .collection('your-collection').doc(documentId);
            await documentRef.set(newData);
            
            res.send(`Hello from Firebase! text: ${text}`);
        } catch(error) {
            res
                .status(500)
                .send(`Hello from Firebase! error: ${error}`);
        }

    });
});