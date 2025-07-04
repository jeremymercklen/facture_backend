// services/customer.js
const CustomerDAO = require('../datamodel/customerdao')
const Customer = require('../datamodel/customer')

module.exports = class CustomerService {
    constructor(db) {
        this.dao = new CustomerDAO(db)
    }

    async insert(iscompany, name, addressid, phone, email, userid) {
        const existingCustomer = await this.dao.findByEmail(email)
        if (!existingCustomer) {
            const customer = new Customer(
                null,
                iscompany,
                name,
                addressid,
                phone,
                email,
                userid
            )
            return this.dao.insert(customer)
        }
        return null
    }

    async findByEmail(email) {
        return this.dao.findByEmail(email.trim())
    }

    async findById(id) {
        return this.dao.findById(id)
    }

    async findByUserId(userid) {
        return this.dao.findByUserId(userid)
    }

    async findAll() {
        return this.dao.findAll()
    }

    async update(customer) {
        return this.dao.update(customer)
    }

    async delete(id) {
        return this.dao.delete(id)
    }
}