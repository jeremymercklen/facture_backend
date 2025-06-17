module.exports = class BillLine {
    constructor(id, text, quantity, price, billid) {
        this.id = id
        this.text = text
        this.quantity = quantity
        this.price = price
        this.billid = billid
    }
}