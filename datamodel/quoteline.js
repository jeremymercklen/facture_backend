module.exports = class Customer {
    constructor(id, text, quantity, price, quoteid) {
        this.id = id
        this.text = text
        this.quantity = quantity
        this.price = price
        this.quoteid = quoteid
    }
}