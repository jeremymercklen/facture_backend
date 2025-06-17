module.exports = class User {
    constructor(id, firstname, lastname, birthday, addressip, email, phone, turnover, chargerate, challenge, isadmin) {
        this.id = id
        this.firstname = firstname
        this.lastname = lastname
        this.birthday = birthday
        this.addressip = addressip
        this.email = email
        this.phone = phone
        this.turnover = turnover
        this.chargerate = chargerate
        this.challenge = challenge
        this.isadmin = isadmin
    }
}