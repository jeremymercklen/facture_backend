const BaseDAO = require('./basedao')
const Project = require('./project')

module.exports = class ProjectDAO extends BaseDAO {
    constructor(db) {
        super(db, "project")
    }

    createTable() {
        return this.db.query(`
            CREATE TABLE project (
                id SERIAL PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                status VARCHAR(15) NOT NULL CHECK (
                    status IN ('prospect', 'quote_sent', 'quote_accepted', 'started', 'finished', 'canceled')
                ),
                customerid INT REFERENCES customer (id) NOT NULL
            )
        `)
    }

    async insert(project) {
        const result = await this.db.query(
            `INSERT INTO project(name, status, customerid)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [project.name, project.status, project.customerid]
        )
        return this.transformRow(result.rows[0])
    }

    async update(project) {
        const result = await this.db.query(
            `UPDATE project 
             SET name = $1, status = $2
             WHERE id = $3 AND customerid = $4
             RETURNING *`,
            [project.name, project.status, project.id, project.customerid]
        )
        return this.transformRow(result.rows[0])
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM project WHERE id = $1`,
            [id]
        )
        return this.transformRow(result.rows[0])
    }

    async findByUserIdWithCustomerInfo(userId) {
        const result = await this.db.query(`
            SELECT p.*,
                   c.email as customeremail
            FROM project p
            JOIN customer c ON p.customerid = c.id
            JOIN useraccount u ON c.userid = u.id
            WHERE u.id = $1
        `, [userId])
        return result.rows
    }

    async findByCustomerId(customerId) {
        const result = await this.db.query(
            `SELECT * FROM project WHERE customerid = $1`,
            [customerId]
        )
        return result.rows.map(row => this.transformRow(row))
    }

    async delete(id, customerId) {
        await this.db.query(
            `DELETE FROM project WHERE id = $1 AND customerid = $2`,
            [id, customerId]
        )
    }

    transformRow(row) {
        if (!row) return null
        return new Project(
            row.id,
            row.name,
            row.status,
            row.customerid
        )
    }
}