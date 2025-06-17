module.exports = class Bill {
    constructor(id,number, state, paymentlimitdate, paymenttype, paymentdate, note, quoteid) {
        this.id = id
        this.number = number
        this.state = state
        this.paymentlimitdate = paymentlimitdate
        this.paymenttype = paymenttype
        this.paymentdate = paymentdate
        this.note = note
        this.quoteid = quoteid
    }
}