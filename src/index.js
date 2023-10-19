const { default: Auth } = require("./auth")
const { default: GameManager } = require("./util/manager/game_manager")
const { default: MemberManager } = require("./util/manager/member_manager")
// const { default: FirebaseManager } = require("./util/manager/firebase_manager")

window.bm = {
    auth: Auth.getInstance(),

    memberManager: MemberManager.getInstance(),
    gameManager: GameManager.getInstance(),
}