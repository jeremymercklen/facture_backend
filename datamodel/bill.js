module.exports = class Bill {
    static STATES = {
        DRAFT: 'draft',
        EDITED: 'edited',
        SENT: 'sent',
        PAID: 'paid'
    }

    constructor(id, number, state, paymentlimitdate, paymenttype, paymentdate, note, quoteid) {
        this.id = id
        this.number = number
        this.state = state
        this.paymentlimitdate = paymentlimitdate
        this.paymenttype = paymenttype
        this.paymentdate = paymentdate
        this.note = note
        this.projectid = quoteid
    }
}