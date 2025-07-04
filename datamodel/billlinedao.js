const BaseDAO = require('./basedao')
const BillLine = require('./billline')

module.exports = class BillLineDAO extends BaseDAO {
    constructor(db) {
        super(db, "billline")
    }

    async createTable() {
        return this.db.query(`
            CREATE TABLE billline (
                id SERIAL PRIMARY KEY NOT NULL,
                text TEXT NOT NULL,
                quantity INT NOT NULL,
                price NUMERIC NOT NULL,
                billid INT REFERENCES bill (id) NOT NULL
            )
        `)
    }

    async insert(billLine) {
        const result = await this.db.query(
            `INSERT INTO billline (text, quantity, price, billid)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [billLine.text, billLine.quantity, billLine.price, billLine.billid]
        )
        return this.transformRow(result.rows[0])
    }

    async update(billLine) {
        const result = await this.db.query(
            `UPDATE billline 
             SET text = $1, quantity = $2, price = $3
             WHERE id = $4 AND billid = $5
             RETURNING *`,
            [billLine.text, billLine.quantity, billLine.price, billLine.id, billLine.billid]
        )
        return this.transformRow(result.rows[0])
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM billline WHERE id = $1`,
            [id]
        )
        return this.transformRow(result.rows[0])
    }

    async findByBillId(billId) {
        const result = await this.db.query(
            `SELECT * FROM billline WHERE billid = $1`,
            [billId]
        )
        return result.rows.map(row => this.transformRow(row))
    }

    async delete(id, billId) {
        await this.db.query(
            `DELETE FROM billline WHERE id = $1 AND billid = $2`,
            [id, billId]
        )
    }

    transformRow(row) {
        if (!row) return null
        return new BillLine(
            row.id,
            row.text,
            row.quantity,
            row.price,
            row.billid
        )
    }
}