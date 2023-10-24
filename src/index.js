const { default: Auth } = require("./auth")
const { default: GameManager } = require("./manager/game_manager")
const { default: MemberManager } = require("./manager/member_manager")
// const { default: FirebaseManager } = require("./util/manager/firebase_manager")

window.bm = {
    auth: Auth.getInstance(),

    class: {
        Auth,
        GameManager,
        MemberManager,
    },

    memberManager: MemberManager.getInstance(),
    gameManager: GameManager.getInstance(),
}