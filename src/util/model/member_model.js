export default class MemberModel {
    constructor({
        email, isAdmin, name, photoURL, point, team, uid
    }) {
        this.email = email;
        this.isAdmin = isAdmin;
        this.name = name;
        this.photoURL = photoURL;
        this.point = point;
        this.team = team;
        this.uid = uid;
    }
}