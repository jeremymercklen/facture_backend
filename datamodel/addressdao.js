const BaseDAO = require('./basedao')
const Address = require('./address')

module.exports = class AddressDAO extends BaseDAO {
    constructor(db) {
        super(db, "address")
    }

    async createTable() {
        await this.db.query(`
            CREATE TABLE address(
                id SERIAL PRIMARY KEY,
                line1 TEXT NOT NULL,
                line2 TEXT,
                line3 TEXT,
                postalcode INT NOT NULL,
                city TEXT NOT NULL,
                country TEXT NOT NULL
            )
        `)
    }

    async insert(address) {
        const result = await this.db.query(
            `INSERT INTO address(line1, line2, line3, postalcode, city, country)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [address.line1, address.line2, address.line3, address.postalcode, address.city, address.country]
        )
        return result.rows[0]
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM address WHERE id = $1`,
            [id]
        )
        return result.rows[0] || null
    }

    async findAll() {
        const result = await this.db.query('SELECT * FROM address')
        return result.rows
    }

    async update(address) {
        const result = await this.db.query(
            `UPDATE address
             SET line1 = $1, line2 = $2, line3 = $3, postalcode = $4, city = $5, country = $6
             WHERE id = $7
             RETURNING *`,
            [address.line1, address.line2, address.line3, address.postalcode, address.city, address.country, address.id]
        )
        return result.rows[0] || null
    }

    async delete(id) {
        await this.db.query('DELETE FROM address WHERE id = $1', [id])
    }
}