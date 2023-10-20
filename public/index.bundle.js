/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./key.js":
/*!****************!*\
  !*** ./key.js ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    firebaseConfig: {\n        apiKey: \"AIzaSyB-5HRZZzrug4moRqhNV4-BBXnN5w7_bMg\",\n        authDomain: \"logifestival.firebaseapp.com\",\n        projectId: \"logifestival\",\n        storageBucket: \"logifestival.appspot.com\",\n        messagingSenderId: \"504262957769\",\n        appId: \"1:504262957769:web:d5b9e337dd4b663b894b18\",\n        measurementId: \"G-Z6D3QV3JDQ\"\n    }\n});\n\n//# sourceURL=webpack://logi-festival/./key.js?");

/***/ }),

/***/ "./src/auth.js":
/*!*********************!*\
  !*** ./src/auth.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Auth)\n/* harmony export */ });\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/auth */ \"./node_modules/firebase/auth/dist/esm/index.esm.js\");\n/* harmony import */ var _util_manager_firebase_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/manager/firebase_manager */ \"./src/util/manager/firebase_manager.js\");\n/* harmony import */ var _util_manager_member_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/manager/member_manager */ \"./src/util/manager/member_manager.js\");\n\n\n\n\nclass Auth {\n    static instance = null;\n    static getInstance() {\n        if (Auth.instance === null) {\n            Auth.instance = new Auth();\n        }\n        return Auth.instance;\n    }\n\n    uid = null;\n\n    constructor() {\n        (0,firebase_auth__WEBPACK_IMPORTED_MODULE_0__.onAuthStateChanged)(_util_manager_firebase_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].auth, async (user) => {\n            if (user) {\n                console.log({\n                    user,\n                });\n                this.uid = user.uid;\n                \n                const memberManager = _util_manager_member_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getInstance();\n                const me = memberManager.me;\n                if (me) {\n                    Auth.signInHtml(me);\n                    _util_manager_member_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].meInHtml(me);\n                } else {\n                    memberManager.setMeByUid(this.uid);\n                    Auth.signInHtml(memberManager.me);\n                }\n            } else {\n                this.uid = null;\n                // window.memberInGoogle = null;\n                // window.memberInFirestore = null;\n                // window.onSignOut();\n                // console.log('user signed out');\n            }\n        });\n    }\n\n    showPopup() {\n        const loginButton = document.getElementById('loginButton');\n        loginButton.style.display = 'none';\n    \n        const loginSpinner = document.getElementById('loginSpinner');\n        loginSpinner.style.display = 'inline-block';\n\n        (0,firebase_auth__WEBPACK_IMPORTED_MODULE_0__.signInWithPopup)(\n            _util_manager_firebase_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].auth, \n            _util_manager_firebase_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].provider\n        ).then((result) => {\n            loginButton.style.display = 'inline-block'\n            loginButton.disabled = true;\n            loginButton.innerText = '유저 정보를 생성중입니다...';\n        }).catch((error) => {\n            console.error(error);\n            alert('[showPopup] 로그인 팝업 뛰우는데 실패했습니다.');\n            loginButton.style.display = 'inline-block'\n        }).finally(() => {\n            loginSpinner.style.display = 'none';;\n        });\n    }\n\n    logout() {\n        (0,firebase_auth__WEBPACK_IMPORTED_MODULE_0__.signOut)(_util_manager_firebase_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].auth).then(() => {\n            // Sign-out successful.\n            document.getElementById('memberBox1').style.display = 'none';\n            // document.getElementById('memberBox2').style.display = 'none';\n            const guestBox = document.getElementById('guestBox');\n            guestBox.style.display = 'block';\n        }).catch((error) => {\n            // An error happened.\n            alert('로그아웃에 실패했습니다.');\n        });\n    }\n\n\n    static signInHtml(member) {\n        if (!member) return;\n        const profileImg = document.getElementById('profile-img');\n        profileImg.src = member.photoURL;\n        const name = document.getElementById('name');\n        name.innerText = member.name;\n        const email = document.getElementById('email');\n        email.innerText = member.email;\n\n        document.getElementById('memberBox1').style.display = 'block';\n        // document.getElementById('memberBox2').style.display = 'block';\n        const guestBox = document.getElementById('guestBox');\n        guestBox.style.display = 'none';\n    }\n\n\n\n\n};\n\n//# sourceURL=webpack://logi-festival/./src/auth.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const { default: Auth } = __webpack_require__(/*! ./auth */ \"./src/auth.js\")\nconst { default: GameManager } = __webpack_require__(/*! ./util/manager/game_manager */ \"./src/util/manager/game_manager.js\")\nconst { default: MemberManager } = __webpack_require__(/*! ./util/manager/member_manager */ \"./src/util/manager/member_manager.js\")\n// const { default: FirebaseManager } = require(\"./util/manager/firebase_manager\")\n\nwindow.bm = {\n    auth: Auth.getInstance(),\n\n    class: {\n        Auth,\n        GameManager,\n        MemberManager,\n    },\n\n    memberManager: MemberManager.getInstance(),\n    gameManager: GameManager.getInstance(),\n}\n\n//# sourceURL=webpack://logi-festival/./src/index.js?");

/***/ }),

/***/ "./src/util/manager/betting_manager.js":
/*!*********************************************!*\
  !*** ./src/util/manager/betting_manager.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ BettingManager)\n/* harmony export */ });\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/functions */ \"./node_modules/firebase/functions/dist/esm/index.esm.js\");\n/* harmony import */ var _member_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./member_manager */ \"./src/util/manager/member_manager.js\");\n/* harmony import */ var _firebase_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./firebase_manager */ \"./src/util/manager/firebase_manager.js\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/firestore */ \"./node_modules/firebase/firestore/dist/esm/index.esm.js\");\n\n\n\n\n\nclass BettingManager {\n    static instance = null;\n    static getInstance() {\n        if (BettingManager.instance === null) {\n            BettingManager.instance = new BettingManager();\n        }\n        return BettingManager.instance;\n    }\n\n    constructor() {\n        \n    }\n\n    static go(gameId, selecOption, point) {\n        return new Promise((resolve, reject) => {\n            const functionName = 'betting';\n            const queryParameters = {\n                selecOption,\n                point,\n                gameId,\n            };\n            const queryString = Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&');\n            // const baseUrl = 'https://asia-northeast3-logifestival.cloudfunctions.net';\n            const baseUrl = _firebase_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].functionsApiUrl;\n            const functionUrl = `${baseUrl}/${functionName}?${queryString}`;\n            \n            (0,firebase_functions__WEBPACK_IMPORTED_MODULE_0__.httpsCallableFromURL)(\n                _firebase_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].functions, \n                functionUrl,\n            )()\n                .then((result) => {\n                    // // Read result of the Cloud Function.\n                    // /** @type {any} */\n                    // const data = result.data;\n                    // const sanitizedMessage = data.text;\n                    console.log({\n                        result,\n                    });\n                    resolve(result.data);\n                }).catch(err => {\n                    console.log({\n                        err,\n                        // code,\n                        // message,\n                        // details,\n                    });\n                    resolve(err.data);\n                })\n        });\n    }\n\n    static cancel(logId) {\n        return new Promise((resolve, reject) => {\n            const functionName = 'cancelBet';\n            const queryParameters = {\n                logId,\n            };\n            const queryString = Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&');\n            // const baseUrl = 'https://asia-northeast3-logifestival.cloudfunctions.net';\n            const baseUrl = _firebase_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].functionsApiUrl;\n            const functionUrl = `${baseUrl}/${functionName}?${queryString}`;\n    \n            (0,firebase_functions__WEBPACK_IMPORTED_MODULE_0__.httpsCallableFromURL)(\n                _firebase_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].functions,\n                functionUrl,\n            )()\n                .then((result) => {\n                    // // Read result of the Cloud Function.\n                    // /** @type {any} */\n                    // const data = result.data;\n                    // const sanitizedMessage = data.text;\n                    console.log({\n                        result,\n                    });\n                    resolve(result.data);\n                }).catch(err => {\n                    console.log({\n                        err,\n                        // code,\n                        // message,\n                        // details,\n                    });\n                    resolve(err.data);\n                })\n        });\n    }\n\n    static async updateIsOnBettingById(id, bool) {\n        try {\n            const gameRef = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.doc)(_firebase_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].db, \"games\", id);\n            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.updateDoc)(gameRef, {\n                isOnBetting: bool,\n            });\n\n            if (bool) {\n                alert('배팅을 허용 시켰습니다.');\n            } else {\n                alert('배팅을 중지 시켰습니다.');\n            }\n            return true;\n        } catch(err) {\n            console.error(err);\n            alert('배팅제한 값 업데이트 하는데 실패했습니다.');\n            return false;\n        }\n\n    }\n\n    static async setModalInHtml(game) {\n        const label = document.getElementById('bettingModalLabel');\n        label.innerText = game.name + ' 배팅';\n        const bettingTeamBox = document.getElementById('bettingTeamBox');\n        bettingTeamBox.innerHTML = '';\n\n        const bettingOptions = document.createElement('div');\n        bettingOptions.id = 'bettingOptions';\n        bettingTeamBox.appendChild(bettingOptions);\n\n        game.options.forEach((option) => {\n            const formCheck = document.createElement('div');\n            formCheck.classList.add('form-check');\n            const formCheckInput = document.createElement('input');\n            formCheckInput.classList.add('form-check-input');\n            formCheckInput.type = 'radio';\n            formCheckInput.name = 'betting';\n            formCheckInput.value = option;\n            formCheckInput.id = option;\n            formCheck.appendChild(formCheckInput);\n            const formCheckLabel = document.createElement('label');\n            formCheckLabel.classList.add('form-check-label');\n            formCheckLabel.setAttribute('for', option);\n            formCheckLabel.innerText = option;\n            formCheck.appendChild(formCheckLabel);\n        \n            bettingOptions.appendChild(formCheck);\n        });\n\n        const pointInput = document.getElementById('pointInput');\n        const submitButton = document.getElementById('bettingSubmitButton');\n        submitButton.onclick = async () => {\n            const spinner = document.getElementById('bettingSubmitSpinner');\n            const selectOptionDoc = document.querySelector('input[name=\"betting\"]:checked');\n            let selectOption = '';\n            if (selectOptionDoc) {\n                selectOption = selectOptionDoc.value;\n            } else {\n                alert('옵션을 선택해주세요.');\n                return;\n            }\n            if (pointInput.value === '') {\n                alert('포인트를 입력해주세요.');\n                return;\n            }\n\n            spinner.style.display = 'inline-block';\n            submitButton.style.display = 'none';\n\n            try {\n                const data = await BettingManager.go(\n                    game.id,\n                    selectOption, \n                    pointInput.value,\n                );\n                if (data.isErr) {\n                    alert('배팅에 실패했습니다. ' + data.message);\n                } else {\n                    _member_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setPointInHtml(data.myPoint);\n                    alert('정상적으로 배팅 완료되었습니다.')\n                }\n            } catch(err) {\n                alert('서버에 문제가 생겼습니다. [setModalInHtml] ' + err.message);\n            }\n\n            spinner.style.display = 'none';\n            submitButton.style.display = 'inline-block';\n\n        } \n    }\n}\n\n//# sourceURL=webpack://logi-festival/./src/util/manager/betting_manager.js?");

/***/ }),

/***/ "./src/util/manager/firebase_manager.js":
/*!**********************************************!*\
  !*** ./src/util/manager/firebase_manager.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ FirebaseManager)\n/* harmony export */ });\n/* harmony import */ var key__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! key */ \"./key.js\");\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/app */ \"./node_modules/firebase/app/dist/esm/index.esm.js\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/auth */ \"./node_modules/firebase/auth/dist/esm/index.esm.js\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/firestore */ \"./node_modules/firebase/firestore/dist/esm/index.esm.js\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/functions */ \"./node_modules/firebase/functions/dist/esm/index.esm.js\");\n\n\n\n\n\n\nconst firebaseConfig = key__WEBPACK_IMPORTED_MODULE_0__[\"default\"].firebaseConfig;\nconst app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_1__.initializeApp)(firebaseConfig);\nconst auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_2__.getAuth)(app);\nconst db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.getFirestore)(app);\nconst functions = (0,firebase_functions__WEBPACK_IMPORTED_MODULE_4__.getFunctions)(app);\nconst provider = new firebase_auth__WEBPACK_IMPORTED_MODULE_2__.GoogleAuthProvider();\n\nprovider.setCustomParameters({\n    'login_hint': 'int@logibros.com'\n});\n\nclass FirebaseManager {\n    static auth = auth;\n    static db = db;\n    static functions = functions;\n    static provider = provider;\n\n    // static functionsApiUrl = 'https://asia-northeast3-logifestival.cloudfunctions.net';\n    static functionsApiUrl = 'http://localhost:5001/logifestival/asia-northeast3';\n}\n\n//# sourceURL=webpack://logi-festival/./src/util/manager/firebase_manager.js?");

/***/ }),

/***/ "./src/util/manager/game_manager.js":
/*!******************************************!*\
  !*** ./src/util/manager/game_manager.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ GameManager)\n/* harmony export */ });\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/firestore */ \"./node_modules/firebase/firestore/dist/esm/index.esm.js\");\n/* harmony import */ var _firebase_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./firebase_manager */ \"./src/util/manager/firebase_manager.js\");\n/* harmony import */ var _betting_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./betting_manager */ \"./src/util/manager/betting_manager.js\");\n/* harmony import */ var _model_game_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../model/game_model */ \"./src/util/model/game_model.js\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/functions */ \"./node_modules/firebase/functions/dist/esm/index.esm.js\");\n/* harmony import */ var _member_manager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./member_manager */ \"./src/util/manager/member_manager.js\");\n\n\n\n\n\n\n\nclass GameManager{\n    static instance = null;\n    static getInstance() {\n        if (GameManager.instance === null) {\n            GameManager.instance = new GameManager();\n        }\n        return GameManager.instance;\n    }\n\n    children = [];\n\n    constructor() {\n        this._watchCollection();\n    }\n\n    async _watchCollection() {\n        if (this._watching) return;\n        this._watching = true;\n        \n        await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.onSnapshot)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.collection)(_firebase_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].db, \"games\"), (querySnapshot) => {\n            const games = querySnapshot.docs\n                .map(doc => doc.data())\n                .sort((a, b) => b.createdAt - a.createdAt);\n\n            console.log({\n                games,\n            });\n            this.children = games;\n            GameManager.setListInHtml(games);\n        });\n\n    }\n\n    static answerSet(id, answer) {\n        return new Promise((resolve, reject) => {\n            const functionName = 'answerSet';\n            const queryParameters = {\n                gameId: id,\n                answer\n            };\n            const queryString = Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&');\n            const baseUrl = _firebase_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].functionsApiUrl;\n            const functionUrl = `${baseUrl}/${functionName}?${queryString}`;\n            \n            (0,firebase_functions__WEBPACK_IMPORTED_MODULE_4__.httpsCallableFromURL)(\n                _firebase_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].functions, \n                functionUrl,\n            )()\n                .then((result) => {\n                    // // Read result of the Cloud Function.\n                    // /** @type {any} */\n                    // const data = result.data;\n                    // const sanitizedMessage = data.text;\n                    console.log({\n                        result,\n                    });\n                    resolve(result.data);\n                }).catch(err => {\n                    console.log({\n                        err,\n                        // code,\n                        // message,\n                        // details,\n                    });\n                    resolve(err.data);\n                })\n        });\n        \n    }\n\n    static async teamAdd(title) {\n        await GameManager.add(\n            _model_game_model__WEBPACK_IMPORTED_MODULE_3__[\"default\"].createByNameAndOptions(title, [\n                '청팀', '백팀'\n            ]),\n        );\n    }\n\n    static async logibrosAdd(title) {\n        await GameManager.add(\n            _model_game_model__WEBPACK_IMPORTED_MODULE_3__[\"default\"].createByNameAndOptions(title, [\n                \"노상민\",\n                \"최성환\",\n                \"김효상\",\n                \"김형기\",\n                \"심지훈\",\n                \"김부민\",\n                \"최수연\",\n                \"서반석\",\n                \"정호룡\",\n                \"임종현\",\n                \"박새롬\",\n                \"신병우\",\n                \"이주혁\",\n                \"서유리\",\n                \"이미르\",\n                \"김상현\",\n                \"박수정\",\n                \"조혜선\",\n            ]),\n        );\n    }\n\n    static async add(game) {\n        if (_member_manager__WEBPACK_IMPORTED_MODULE_5__[\"default\"].getInstance().isAdmin === false) {\n            alert('관리자만 게임을 생성할 수 있습니다.');\n            return;\n        }\n        try {\n            const json = _model_game_model__WEBPACK_IMPORTED_MODULE_3__[\"default\"].toJson(game);\n            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.setDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].db, \"games\", game.id), json);\n            alert('게임 생성에 성공했습니다.');\n        } catch(err) {\n            console.error(err);\n            alert('게임 생성에 실패했습니다.');\n        } finally {\n        }\n    }\n\n    static async getLogsById(id) {\n        const logInGameQuerySnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDocs)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.collection)(_firebase_manager__WEBPACK_IMPORTED_MODULE_1__[\"default\"].db, \"games\", id, \"members\"));\n        return logInGameQuerySnapshot.docs\n            .map(doc => doc.data())\n            .sort((a, b) => b.createdAt - a.createdAt);\n    }\n\n    static setListInHtml(games) {\n        const gameListBox = document.getElementById('gameListBox');\n        const ul = gameListBox.querySelector('ul');\n        ul.innerHTML = '';\n        games.forEach((game) => {\n            const li = document.createElement('li');\n            li.classList.add('list-group-item');\n            li.classList.add('d-flex');\n            li.classList.add('justify-content-between');\n            li.classList.add('align-items-center');\n            const name = document.createElement('span');\n\n            if (game.isOnBetting) {\n                // li.classList.add('list-group-item-success');\n            } else {\n                li.classList.add('list-group-item-secondary');\n                name.classList.add('text-muted');\n            }\n            name.innerText = game.name;\n            li.appendChild(name);\n            ul.appendChild(li);\n\n            const btnGroup = document.createElement('div');\n            btnGroup.classList.add('btn-group');\n            btnGroup.classList.add('btn-group-sm');\n            btnGroup.setAttribute('role', 'group');\n            btnGroup.setAttribute('aria-label', 'Basic example');   \n            li.appendChild(btnGroup);\n\n            const adminButton = document.createElement('button');\n            // gameAdminModal 열기\n            adminButton.classList.add('btn');\n            adminButton.classList.add('btn-warning');\n            adminButton.setAttribute('data-bs-toggle', 'modal');\n            adminButton.setAttribute('data-bs-target', '#gameAdminModal');\n            adminButton.innerText = '관리';\n            adminButton.onclick = () => {\n                const label = document.getElementById('gameAdminModalLabel');\n                label.innerText = game.name + ' 관리';\n\n                const answerSetButton = document.getElementById('answerSetButton');\n                answerSetButton.onclick = async () => {\n                    if (game.answer) {\n                        alert('이미 정답이 설정되었습니다.');\n                        return;\n                    }\n                    const selectOptionDoc = document.querySelector('input[name=\"answer\"]:checked');\n                    if (!selectOptionDoc) {\n                        alert('정답을 선택해주세요.');\n                        return;\n                    }\n                    const answer = selectOptionDoc.value;\n                    const spiner = document.getElementById('answerSetButtonSpinner');\n                    spiner.style.display = 'inline-block';\n                    answerSetButton.style.display = 'none';\n                    const result = await GameManager.answerSet(game.id, answer) || { isErr: true, message: '응답이 없습니다.' };\n                    if (result.isErr) {\n                        alert('정답 설정에 실패했습니다. ' + result.message);\n                    } else {\n                        alert('정답 설정에 성공했습니다.');\n                    }\n                    spiner.style.display = 'none';\n                    answerSetButton.style.display = 'inline-block';\n\n                };\n\n                const adminAnswerBox = document.getElementById('adminAnswerBox');\n                adminAnswerBox.innerHTML = '';\n                game.options.forEach((option) => {\n                    const formCheck = document.createElement('div');\n                    formCheck.classList.add('form-check');\n                    const formCheckInput = document.createElement('input');\n                    formCheckInput.classList.add('form-check-input');\n                    formCheckInput.type = 'radio';\n                    formCheckInput.name = 'answer';\n                    formCheckInput.value = option;\n                    formCheckInput.id = option;\n                    formCheck.appendChild(formCheckInput);\n                    const formCheckLabel = document.createElement('label');\n                    formCheckLabel.classList.add('form-check-label');\n                    formCheckLabel.setAttribute('for', option);\n                    formCheckLabel.innerText = option;\n                    formCheck.appendChild(formCheckLabel);\n                    adminAnswerBox.appendChild(formCheck);\n                });\n                \n\n                const unlockButton = document.getElementById('bettingUnlockButton');\n                const lockButton = document.getElementById('bettingLockButton');\n                unlockButton.style.display = 'inline-block';\n                lockButton.style.display = 'inline-block';\n\n                if (game.isOnBetting) {\n                    unlockButton.style.display = 'none';\n                } else {\n                    lockButton.style.display = 'none';\n                }\n\n                lockButton.onclick = async () => {\n                    const spinner = document.getElementById('bettinglockButtonSpinner');\n                    spinner.style.display = 'inline-block';\n                    lockButton.style.display = 'none';\n                    const isSuccess = await _betting_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].updateIsOnBettingById(game.id, false);\n                    spinner.style.display = 'none';\n                    if (isSuccess) {\n                        game.isOnBetting = false;\n                        unlockButton.style.display = 'inline-block';\n                    } else {\n                        lockButton.style.display = 'inline-block';\n                    }\n                };\n\n                unlockButton.onclick = async () => {\n                    const spinner = document.getElementById('bettinglockButtonSpinner');\n                    spinner.style.display = 'inline-block';\n                    unlockButton.style.display = 'none';\n                    const isSuccess = await _betting_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].updateIsOnBettingById(game.id, true);\n                    spinner.style.display = 'none';\n                    if (isSuccess) {\n                        game.isOnBetting = true;\n                        lockButton.style.display = 'inline-block';\n                    } else {\n                        unlockButton.style.display = 'inline-block';\n                    }\n                }\n            };\n\n            if (_member_manager__WEBPACK_IMPORTED_MODULE_5__[\"default\"].getInstance().isAdmin) {\n                btnGroup.appendChild(adminButton);\n            }\n\n            const detailButton = document.createElement('button');\n            detailButton.classList.add('btn');\n            detailButton.classList.add('btn-info');\n            detailButton.setAttribute('data-bs-toggle', 'modal');\n            detailButton.setAttribute('data-bs-target', '#gameDetailModal');\n            detailButton.innerText = '이력보기';\n            detailButton.onclick = async () => {\n                const spiner = document.getElementById('gameDetailModalSpinner');\n                spiner.style.display = 'inline-block';\n\n                const gameDetailTotalPoint = document.getElementById('gameDetailTotalPoint');\n                gameDetailTotalPoint.innerText = '';\n\n                const logs = await GameManager.getLogsById(game.id);\n                \n                const gameDetailModalBody = document.getElementById('gameDetailModalBody');\n                gameDetailModalBody.innerHTML = '';\n                const gameDetailModalLabel = document.getElementById('gameDetailModalLabel');\n                gameDetailModalLabel.innerText = game.name + ' 상세이력';\n                \n                if (logs.length === 0) {\n                    const logDoc = document.createElement('div');\n                    logDoc.classList.add('list-group-item');\n                    logDoc.innerText = '이력이 없습니다.';\n                    gameDetailModalBody.appendChild(logDoc);\n                }\n                let totalPoint = 0;\n                const logsDoc = document.createElement('ul');\n                logsDoc.classList.add('list-group');\n                gameDetailModalBody.appendChild(logsDoc);\n                logs.forEach((log) => {\n                    const logDoc = document.createElement('div');\n                    logDoc.classList.add('list-group-item');\n                    logDoc.innerText = `${log.userName}님이 '${log.selecOption}'에 ${log.bettingPoint} 배팅했습니다.`;\n                    logsDoc.appendChild(logDoc);\n                    totalPoint += Number(log.bettingPoint);\n                });\n\n                gameDetailTotalPoint.innerText = `총 배팅 포인트: ${totalPoint}`;\n\n                \n\n                spiner.style.display = 'none';\n            }\n            btnGroup.appendChild(detailButton);\n\n            if (game.isOnBetting) {\n                const bettingButton = document.createElement('button');\n                bettingButton.classList.add('btn');\n                bettingButton.classList.add('btn-primary');\n                // class=\"btn btn-info\" data-bs-toggle=\"modal\" data-bs-target=\"#bettingModal\"\n                bettingButton.setAttribute('data-bs-toggle', 'modal');\n                bettingButton.setAttribute('data-bs-target', '#bettingModal');\n\n                bettingButton.innerText = '배팅하기';\n                bettingButton.onclick = () => {\n                    _betting_manager__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setModalInHtml(game);\n                }\n                btnGroup.appendChild(bettingButton);\n            }\n        });\n    }\n}\n\n//# sourceURL=webpack://logi-festival/./src/util/manager/game_manager.js?");

/***/ }),

/***/ "./src/util/manager/member_manager.js":
/*!********************************************!*\
  !*** ./src/util/manager/member_manager.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MemberManager)\n/* harmony export */ });\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/firestore */ \"./node_modules/firebase/firestore/dist/esm/index.esm.js\");\n/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../auth */ \"./src/auth.js\");\n/* harmony import */ var _model_member_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/member_model */ \"./src/util/model/member_model.js\");\n/* harmony import */ var _firebase_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./firebase_manager */ \"./src/util/manager/firebase_manager.js\");\n/* harmony import */ var _betting_manager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./betting_manager */ \"./src/util/manager/betting_manager.js\");\n\n\n\n\n\n\nclass MemberManager {\n    static instance = null;\n    static getInstance() {\n        if (MemberManager.instance === null) {\n            MemberManager.instance = new MemberManager();\n        }\n        return MemberManager.instance;\n    }\n\n    children = [];\n    me = null;\n\n    get isAdmin() {\n        return this.me && this.me.isAdmin;\n    }\n\n    _watching = false;\n\n    constructor() {\n        console.log('MemberManager constructor');\n        this._watchCollection();\n    }\n\n    async _watchCollection() {\n        if (this._watching) return;\n        this._watching = true;\n\n\n        await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.onSnapshot)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.collection)(_firebase_manager__WEBPACK_IMPORTED_MODULE_3__[\"default\"].db, \"members\"), (querySnapshot) => {\n            const members = querySnapshot.docs\n                .map(doc => new _model_member_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"](doc.data()))\n                .sort((a, b) => b.point - a.point);\n\n            this.children = members;\n            MemberManager.setListInHtml(members);\n\n            const uid = _auth__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getInstance().uid;\n            if (uid) {\n                const me = members.find(member => member.uid === uid);\n                this.setMe(me);\n                MemberManager.meInHtml(me);\n                MemberManager.setPointInHtml(me.point);\n            }\n            console.log('watchCollection', {\n                members,\n            });\n        });\n    }\n\n    setMeByUid(uid) {\n        const me = this.children.find(member => member.uid === uid);\n        if (me) this.setMe(me);\n    }\n\n    setMe(member) {\n        this.me = new _model_member_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"](member);\n        _auth__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signInHtml(this.me);\n    }\n\n    static async getLogsByUid(uid) {\n        const logInMemberQuerySnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDocs)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.collection)(_firebase_manager__WEBPACK_IMPORTED_MODULE_3__[\"default\"].db, \"members\", uid, \"games\"));\n        return logInMemberQuerySnapshot.docs\n            .map(doc => doc.data())\n            .sort((a, b) => b.createdAt - a.createdAt);\n    }\n\n    static setPointInHtml(point) {\n        const myPoint = document.getElementById('myPoint');\n        const memberPoint = document.getElementById('memberPoint');\n        memberPoint.innerText = point;\n        myPoint.innerText = point;\n    }\n\n    static meInHtml(me) {\n        const profileImg = document.getElementById('profile-img');\n        const name = document.getElementById('name');\n        const email = document.getElementById('email');\n\n        profileImg.src = me.photoURL;\n        name.innerText = me.name;\n        email.innerText = me.email;\n\n        document.getElementById('memberBox1').style.display = 'block';\n        // document.getElementById('memberBox2').style.display = 'block';\n        const guestBox = document.getElementById('guestBox');\n        guestBox.style.display = 'none';\n\n        if (me.isAdmin) {\n            const gameCreateButton = document.getElementById('gameCreateButton');\n            gameCreateButton.style.display = 'inline-block';\n        }\n    }\n\n    static setListInHtml(members) {\n        const rankBox = document.getElementById('rankBox');\n        const ol = rankBox.querySelector('ol');\n        ol.innerHTML = '';\n        members.forEach((member, index) => {\n            const li = document.createElement('li');\n            li.classList.add('list-group-item');\n            li.classList.add('d-flex');\n            li.classList.add('justify-content-between');\n            li.classList.add('align-items-center');\n\n            const textGroup = document.createElement('div');\n            textGroup.classList.add('text-start');\n            li.appendChild(textGroup);\n\n            const mainText = document.createElement('p');\n            mainText.classList.add('mb-1');\n            mainText.innerText = `${index+1}. ${member.name} - ${member.point}p`;\n\n            const subText = document.createElement('small');\n            subText.classList.add('text-muted');\n            subText.innerText = member.email;\n            textGroup.appendChild(mainText);\n            textGroup.appendChild(subText);\n\n\n\n            const btnGroup = document.createElement('div');\n            btnGroup.classList.add('btn-group');\n            btnGroup.classList.add('btn-group-sm');\n            btnGroup.setAttribute('role', 'group');\n            btnGroup.setAttribute('aria-label', 'Basic example');\n\n            const infoButton = document.createElement('button');\n            infoButton.classList.add('btn');\n            infoButton.classList.add('btn-info');\n            infoButton.setAttribute('data-bs-toggle', 'modal');\n            infoButton.setAttribute('data-bs-target', '#memberDetailModal');\n            infoButton.innerText = '정보보기';\n            infoButton.onclick = async () => {\n                MemberManager.setDetailModalInHtml(member);\n            }\n\n            btnGroup.appendChild(infoButton);\n            li.appendChild(btnGroup);\n\n\n\n            ol.appendChild(li);\n        });\n    }\n\n    static async setDetailModalInHtml(member) {\n        memberEmail.innerText = `${member.email}`;\n        memberPoint.innerText = `${member.point}`;\n\n        const spiner = document.getElementById('memberDetailModalSpinner');\n        spiner.style.display = 'inline-block';\n        const logs = await MemberManager.getLogsByUid(member.uid);\n        console.log({\n            logs\n        });\n\n        const memberDetailModalBody = document.getElementById('memberDetailModalBody');\n        memberDetailModalBody.innerHTML = '';\n        const memberDetailModalLabel = document.getElementById('memberDetailModalLabel');\n        memberDetailModalLabel.innerText = member.name + ' 정보';\n\n        if (logs.length === 0) {\n            const logDoc = document.createElement('div');\n            logDoc.classList.add('list-group-item');\n            logDoc.innerText = '이력이 없습니다.';\n            memberDetailModalBody.appendChild(logDoc);\n        }\n        \n        const logsDoc = document.createElement('ul');\n        logsDoc.classList.add('list-group');\n        memberDetailModalBody.appendChild(logsDoc);\n        logs.forEach((log) => {\n            // list tile\n            const logDoc = document.createElement('div');\n            logDoc.classList.add('list-group-item');\n            logDoc.classList.add('d-flex');\n            logDoc.classList.add('justify-content-between');\n            logDoc.classList.add('align-items-center');\n            // id 부여\n            logDoc.id = log.id;\n\n            const textGroup = document.createElement('div');\n            textGroup.classList.add('text-start');\n            logDoc.appendChild(textGroup);\n\n            const mainText = document.createElement('p');\n            mainText.classList.add('mb-1');\n\n            if (log.receivedPoint) {\n                mainText.innerText = `${log.gameName}에서 ${log.selecOption}(으)로 ${log.bettingPoint} 배팅하여 ${log.receivedPoint} 포인트를 받았습니다.`;\n                logDoc.classList.add('list-group-item-success');\n            } else {\n                mainText.innerText = log.gameName + '에 ' + log.selecOption + '(으)로 ' + log.bettingPoint + ' 배팅했습니다.';\n            }\n            textGroup.appendChild(mainText);\n\n            const subText1 = document.createElement('small');\n            subText1.innerText = '남은 포인트 : ' + log.userPoint;\n            // const subText2 = document.createElement('small');\n            // subText2.innerText = new Date(log.createdAt).toLocaleString();\n            textGroup.appendChild(subText1);\n            // textGroup.appendChild(subText2);\n\n            const spiner = document.createElement('span');\n            spiner.classList.add('spinner-border');\n            spiner.classList.add('spinner-border-sm');\n            spiner.setAttribute('role', 'status');\n            spiner.setAttribute('aria-hidden', 'true');\n            spiner.style.display = 'none';\n            logDoc.appendChild(spiner);\n\n            const cancelBettingButton = document.createElement('button');\n            cancelBettingButton.classList.add('btn');\n            cancelBettingButton.classList.add('btn-sm');\n            cancelBettingButton.classList.add('btn-outline-danger');\n            cancelBettingButton.innerText = '취소';\n            cancelBettingButton.onclick = async () => {\n                spiner.style.display = 'inline-block';\n                cancelBettingButton.style.display = 'none';\n\n                const data = await _betting_manager__WEBPACK_IMPORTED_MODULE_4__[\"default\"].cancel(log.id);\n                if (data.isErr) {\n                    alert('취소에 실패했습니다. ' + data.message);\n                } else {\n                    alert('정상적으로 취소되었습니다.');\n                    const logDoc = document.getElementById(log.id);\n                    logDoc.remove();\n                }\n                spiner.style.display = 'none';\n                cancelBettingButton.style.display = 'inline-block';\n            }\n            // 본인만 취소할 수 있도록\n            if (_auth__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getInstance().uid !== log.uid || log.receivedPoint) {\n                cancelBettingButton.style.display = 'none';\n            }\n            \n            logDoc.appendChild(cancelBettingButton);\n            logsDoc.appendChild(logDoc);\n        });\n\n        spiner.style.display = 'none';\n    }\n}\n\n//# sourceURL=webpack://logi-festival/./src/util/manager/member_manager.js?");

/***/ }),

/***/ "./src/util/model/game_model.js":
/*!**************************************!*\
  !*** ./src/util/model/game_model.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ GameModel)\n/* harmony export */ });\nconst { v4: uuidv4 } = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/index.js\");\n\nclass GameModel {\n    constructor({\n        answer, id, isOnBetting, name, options, createdAt\n    }) {\n        this.answer = answer;\n        this.id = id;\n        this.isOnBetting = isOnBetting;\n        this.name = name;\n        this.options = options;\n        this.createdAt = createdAt;\n    }\n\n    static toJson(gameModel) {\n        return {\n            answer: gameModel.answer,\n            id: gameModel.id,\n            isOnBetting: gameModel.isOnBetting,\n            name: gameModel.name,\n            options: gameModel.options,\n            createdAt: gameModel.createdAt,\n        };\n    }\n\n    static createByNameAndOptions(name, options) {\n        return {\n            id: uuidv4(),\n            answer: \"\",\n            isOnBetting: true,\n            name: name,\n            options: options,\n            createdAt: new Date(),\n        };\n    }\n}\n\n//# sourceURL=webpack://logi-festival/./src/util/model/game_model.js?");

/***/ }),

/***/ "./src/util/model/member_model.js":
/*!****************************************!*\
  !*** ./src/util/model/member_model.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MemberModel)\n/* harmony export */ });\nclass MemberModel {\n    constructor({\n        email, isAdmin, name, photoURL, point, team, uid\n    }) {\n        this.email = email;\n        this.isAdmin = isAdmin;\n        this.name = name;\n        this.photoURL = photoURL;\n        this.point = point;\n        this.team = team;\n        this.uid = uid;\n    }\n}\n\n//# sourceURL=webpack://logi-festival/./src/util/model/member_model.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunklogi_festival"] = self["webpackChunklogi_festival"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_uuid_dist_esm-browser_index_js-node_modules_firebase_app_dist_esm_index_-a15bd4"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;