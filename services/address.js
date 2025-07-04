const AddressDAO = require('../datamodel/addressdao')
const Address = require('../datamodel/address')

module.exports = class AddressService {
    constructor(db) {
        this.dao = new AddressDAO(db)
    }

    async insert(line1, line2, line3, postalcode, city, country) {
        const address = new Address(
            null,
            line1,
            line2,
            line3,
            postalcode,
            city,
            country
        )
        return this.dao.insert(address)
    }

    async findById(id) {
        return this.dao.findById(id)
    }

    async findAll() {
        return this.dao.findAll()
    }

    async update(id, line1, line2, line3, postalcode, city, country) {
        const address = new Address(
            id,
            line1,
            line2,
            line3,
            postalcode,
            city,
            country
        )
        return this.dao.update(address)
    }

    async delete(id) {
        return this.dao.delete(id)
    }
}