import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import FirebaseManager from "./manager/firebase_manager";
import MemberManager from "./manager/member_manager";
import GameManager from "./manager/game_manager";

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
                
                MemberManager.getInstance().setMeByUid(this.uid);
                Auth.signInHtml(MemberManager.getInstance().me);
                MemberManager.meInHtml(MemberManager.getInstance().me);
                MemberManager.setListInHtml(MemberManager.getInstance().children);
                MemberManager.setPointInHtml(MemberManager.getInstance().myPoint);
                GameManager.setListInHtml(GameManager.getInstance().children);
            } else {
                this.uid = null;
            }
        });
    }

    showPopup() {
        const loginButton = document.getElementById('loginButton');
        loginButton.style.display = 'none';
    
        const loginSpinner = document.getElementById('loginSpinner');
        loginSpinner.style.display = 'inline-block';

        signInWithPopup(
            FirebaseManager.auth, 
            FirebaseManager.provider
        ).then((result) => {
            loginButton.style.display = 'inline-block'
            loginButton.disabled = true;
            loginButton.innerText = '유저 정보를 생성중입니다...';
        }).catch((error) => {
            console.error(error);
            alert('[showPopup] 로그인 팝업 뛰우는데 실패했습니다.');
            loginButton.style.display = 'inline-block'
        }).finally(() => {
            loginSpinner.style.display = 'none';;
        });
    }

    logout() {
        signOut(FirebaseManager.auth).then(() => {
            MemberManager.getInstance().out();
            // Sign-out successful.
            document.getElementById('memberBox1').style.display = 'none';
            // document.getElementById('memberBox2').style.display = 'none';
            const guestBox = document.getElementById('guestBox');
            guestBox.style.display = 'block';

            const mainNav = document.getElementById('mainNav');
            mainNav.style.display = 'none';

            const loginButton = document.getElementById('loginButton');
            loginButton.disabled = false;
            loginButton.innerText = '로그인';
            const gameCreateButton = document.getElementById('gameCreateButton');
            gameCreateButton.style.display = 'none';

            GameManager.setListInHtml(GameManager.getInstance().children);
            MemberManager.setListInHtml(MemberManager.getInstance().children);

        }).catch((error) => {
            console.error(error);
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

        const mainNav = document.getElementById('mainNav');
        mainNav.style.display = 'block';

        document.getElementById('memberBox1').style.display = 'block';
        // document.getElementById('memberBox2').style.display = 'block';
        const guestBox = document.getElementById('guestBox');
        guestBox.style.display = 'none';
    }




};