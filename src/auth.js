import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import FirebaseManager from "./util/manager/firebase_manager";
import MemberManager from "./util/manager/member_manager";

export default class Auth {
    static instance = null;
    static getInstance() {
        if (Auth.instance === null) {
            Auth.instance = new Auth();
        }
        return Auth.instance;
    }

    uid = null;

    constructor() {
        onAuthStateChanged(FirebaseManager.auth, async (user) => {
            if (user) {
                console.log({
                    user,
                });
                this.uid = user.uid;
                
                const memberManager = MemberManager.getInstance();
                const me = memberManager.me;
                if (me) {
                    Auth.signInHtml(me);
                } else {
                    memberManager.setMeByUid(this.uid);
                    Auth.signInHtml(memberManager.me);
                }
            } else {
                this.uid = null;
                // window.memberInGoogle = null;
                // window.memberInFirestore = null;
                // window.onSignOut();
                // console.log('user signed out');
            }
        });
    }

    showPopup() {
        signInWithPopup(
            FirebaseManager.auth, 
            FirebaseManager.provider
        ).catch((error) => {
            console.error(error);
            new Error('[showPopup] 로그인 팝업 뛰우는데 실패했습니다.');
        });
    }

    logout() {
        signOut(FirebaseManager.auth).then(() => {
            // Sign-out successful.
            document.getElementById('memberBox1').style.display = 'none';
            // document.getElementById('memberBox2').style.display = 'none';
            const guestBox = document.getElementById('guestBox');
            guestBox.style.display = 'block';
        }).catch((error) => {
            // An error happened.
            alert('로그아웃에 실패했습니다.');
        });
    }


    static signInHtml(member) {
        if (!member) return;
        const profileImg = document.getElementById('profile-img');
        profileImg.src = member.photoURL;
        const name = document.getElementById('name');
        name.innerText = member.name;
        const email = document.getElementById('email');
        email.innerText = member.email;

        document.getElementById('memberBox1').style.display = 'block';
        // document.getElementById('memberBox2').style.display = 'block';
        const guestBox = document.getElementById('guestBox');
        guestBox.style.display = 'none';
    }




};