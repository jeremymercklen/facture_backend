module.exports = class Customer {
    constructor(id, iscompany, name, addressip, phone, email, userid) {
        this.id = id
        this.iscompany = iscompany
        this.name = name
        this.addressip = addressip
        this.phone = phone
        this.email = email
        this.userid = userid
    }
}