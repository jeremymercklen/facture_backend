const BaseDAO = require('./basedao')
const Quote = require('./quote')

module.exports = class QuoteDAO extends BaseDAO {
    constructor(db) {
        super(db, "quote")
    }

    async createTable() {
        return this.db.query(`
            CREATE TABLE quote
            (
                id           SERIAL PRIMARY KEY          NOT NULL,
                state        VARCHAR(15)                 NOT NULL CHECK (
                    state IN ('draft', 'sent', 'accepted', 'refused')
                    ),
                projectid    INT REFERENCES project (id) NOT NULL,
                creationdate DATE                        NOT NULL DEFAULT CURRENT_DATE
            )
        `)
    }

    async insert(quote) {
        const result = await this.db.query(
            `INSERT INTO quote (state, projectid)
         VALUES ($1, $2)
         RETURNING *`,
            [quote.state, quote.projectid]
        )
        return this.transformRow(result.rows[0])
    }

    async update(quote) {
        const result = await this.db.query(
            `UPDATE quote
         SET state = $1
         WHERE id = $2 AND projectid = $3
         RETURNING *`,
            [quote.state, quote.id, quote.projectid]
        )
        return this.transformRow(result.rows[0])
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM quote WHERE id = $1`,
            [id]
        )
        return this.transformRow(result.rows[0])
    }

    async findByProjectId(projectId) {
        const result = await this.db.query(
            `SELECT * FROM quote WHERE projectid = $1`,
            [projectId]
        )
        return result.rows.map(row => this.transformRow(row))
    }

    async delete(id, projectId) {
        await this.db.query(
            `DELETE FROM quote WHERE id = $1 AND projectid = $2`,
            [id, projectId]
        )
    }

    transformRow(row) {
        if (!row) return null
        return new Quote(
            row.id,
            row.state,
            row.creationdate,
            row.projectid
        )
    }
}