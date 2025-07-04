const BaseDAO = require('./basedao')
const QuoteLine = require('./quoteline')

module.exports = class QuoteLineDAO extends BaseDAO {
    constructor(db) {
        super(db, "quoteline")
    }

    async createTable() {
        return this.db.query(`
            CREATE TABLE quoteline (
                id SERIAL PRIMARY KEY NOT NULL,
                text TEXT NOT NULL,
                quantity INT NOT NULL,
                price NUMERIC NOT NULL,
                quoteid INT REFERENCES quote (id) NOT NULL
            )
        `)
    }

    async insert(quoteLine) {
        const result = await this.db.query(
            `INSERT INTO quoteline (text, quantity, price, quoteid)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [quoteLine.text, quoteLine.quantity, quoteLine.price, quoteLine.quoteid]
        )
        return this.transformRow(result.rows[0])
    }

    async update(quoteLine) {
        const result = await this.db.query(
            `UPDATE quoteline 
             SET text = $1, quantity = $2, price = $3
             WHERE id = $4 AND quoteid = $5
             RETURNING *`,
            [quoteLine.text, quoteLine.quantity, quoteLine.price, quoteLine.id, quoteLine.quoteid]
        )
        return this.transformRow(result.rows[0])
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM quoteline WHERE id = $1`,
            [id]
        )
        return this.transformRow(result.rows[0])
    }

    async findByQuoteId(quoteId) {
        const result = await this.db.query(
            `SELECT * FROM quoteline WHERE quoteid = $1`,
            [quoteId]
        )
        return result.rows.map(row => this.transformRow(row))
    }

    async delete(id, quoteId) {
        await this.db.query(
            `DELETE FROM quoteline WHERE id = $1 AND quoteid = $2`,
            [id, quoteId]
        )
    }

    transformRow(row) {
        if (!row) return null
        return new QuoteLine(
            row.id,
            row.text,
            row.quantity,
            row.price,
            row.quoteid
        )
    }
}