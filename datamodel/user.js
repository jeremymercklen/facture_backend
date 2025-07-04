module.exports = class User {
    constructor(id, firstname, lastname, birthday, addressid, email, phone, turnover, chargerate, challenge, isadmin) {
        this.id = id
        this.firstname = firstname
        this.lastname = lastname
        this.birthday = birthday
        this.addressid = addressid
        this.email = email
        this.phone = phone
        this.turnover = turnover
        this.chargerate = chargerate
        this.challenge = challenge
        this.isadmin = isadmin
    }
}