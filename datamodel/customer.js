module.exports = class Customer {
    constructor(id, iscompany, name, addressid, phone, email, userid) {
        this.id = id
        this.iscompany = iscompany
        this.name = name
        this.addressid = addressid
        this.phone = phone
        this.email = email
        this.userid = userid
    }
}