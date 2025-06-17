const BaseDAO = require('./basedao')
const Address = require('./address')

module.exports = class AddressDAO extends BaseDAO {
    constructor(db) {
        super(db, "address")
    }

    create() {
        return this.db.query(
            "CREATE TABLE address (id SERIAL PRIMARY KEY NOT NULL, street TEXT NOT NULL, postalcode TEXT NOT NULL, city TEXT NOT NULL)"
        )
    }

    async insert(address) {
        const result = await this.db.query(
            `INSERT INTO address(street, postalcode, city)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [address.street, address.postalcode, address.city]
        )
        return result.rows[0].id
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM address WHERE id = $1`,
            [id]
        )
        if (result.rows.length === 0) {
            return null
        }
        const a = result.rows[0]
        return new Address(a.id, a.street, a.postalcode, a.city)
    }

    async findAll() {
        const result = await this.db.query('SELECT * FROM address')
        return result.rows.map(a => new Address(a.id, a.street, a.postalcode, a.city))
    }

    async update(address) {
        await this.db.query(
            `UPDATE address
             SET street = $1, postalcode = $2, city = $3
             WHERE id = $4`,
            [address.street, address.postalcode, address.city, address.id]
        )
    }

    async delete(id) {
        await this.db.query('DELETE FROM address WHERE id = $1', [id])
    }
}