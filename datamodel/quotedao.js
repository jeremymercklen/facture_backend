const BaseDAO = require('./basedao')
const Quote = require('./quote')

module.exports = class QuoteDAO extends BaseDAO {
    constructor(db) {
        super(db, "quote")
    }

    create() {
        return this.db.query(`
        CREATE TYPE IF NOT EXISTS quote_state AS ENUM ('draft', 'sent', 'accepted', 'refused');
        CREATE TABLE quote (
            id SERIAL PRIMARY KEY NOT NULL,
            number INT NOT NULL,
            state quote_state NOT NULL,
            creationdate DATE NOT NULL,
            projectid INT REFERENCES project (id) NOT NULL
        )`
        )
    }

    async insert(quote) {
        const result = await this.db.query(
            `INSERT INTO quote(number, state, creationdate, projectid)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [quote.number, quote.state, quote.creationdate, quote.projectid]
        )
        return result.rows[0].id
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM quote WHERE id = $1`,
            [id]
        )
        if (result.rows.length === 0) {
            return null
        }
        const q = result.rows[0]
        return new Quote(q.id, q.number, q.state, q.creationdate, q.projectid)
    }

    async findAll() {
        const result = await this.db.query('SELECT * FROM quote')
        return result.rows.map(q => new Quote(q.id, q.number, q.state, q.creationdate, q.projectid))
    }

    async update(quote) {
        await this.db.query(
            `UPDATE quote
             SET number = $1, state = $2, creationdate = $3, projectid = $4
             WHERE id = $5`,
            [quote.number, quote.state, quote.creationdate, quote.projectid, quote.id]
        )
    }

    async delete(id) {
        await this.db.query('DELETE FROM quote WHERE id = $1', [id])
    }
}