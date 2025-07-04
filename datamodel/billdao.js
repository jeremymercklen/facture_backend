const BaseDAO = require('./basedao')
const Bill = require('./bill')

module.exports = class BillDAO extends BaseDAO {
    constructor(db) {
        super(db, "bill")
    }

    async createTable() {
        return this.db.query(`
            DROP TYPE IF EXISTS bill_state CASCADE;
            CREATE TYPE bill_state AS ENUM ('draft', 'edited', 'sent', 'paid');
            CREATE TABLE IF NOT EXISTS bill (
                id SERIAL PRIMARY KEY NOT NULL,
                number INT NOT NULL,
                state bill_state NOT NULL DEFAULT 'draft',
                paymentlimitdate DATE,
                paymenttype VARCHAR(50),
                paymentdate DATE,
                note TEXT,
                projectid INT REFERENCES project (id) NOT NULL
            )
        `)
    }

    async insert(bill) {
        const result = await this.db.query(
            `INSERT INTO bill (number, state, paymentlimitdate, paymenttype,
                             paymentdate, note, projectid)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [bill.number, bill.state, bill.paymentlimitdate, bill.paymenttype,
                bill.paymentdate, bill.note, bill.projectid]
        )
        return this.transformRow(result.rows[0])
    }

    async update(bill) {
        const result = await this.db.query(
            `UPDATE bill 
         SET number = $1, 
             state = $2, 
             paymentlimitdate = $3, 
             paymenttype = $4,
             paymentdate = $5, 
             note = $6, 
             projectid = $7
         WHERE id = $8
         RETURNING *`,
            [bill.number, bill.state, bill.paymentlimitdate, bill.paymenttype,
                bill.paymentdate, bill.note, bill.projectid, bill.id]
        )
        return this.transformRow(result.rows[0])
    }

    async findLastProcessedBill(userId) {
        const result = await this.db.query(
            `SELECT DISTINCT ON (b.number) b.*
             FROM bill b
                      INNER JOIN project p ON b.projectid = p.id
                      INNER JOIN customer c ON p.customerid = c.id
             WHERE b.state IN ($1, $2)
               AND c.userid = $3
             ORDER BY b.number DESC
             LIMIT 1`,
            [Bill.STATES.SENT, Bill.STATES.PAID, userId]
        )
        return this.transformRow(result.rows[0])
    }

    async findByProjectId(projectId) {
        const result = await this.db.query(
            `SELECT * FROM bill WHERE projectid = $1
         ORDER BY number ASC`,
            [projectId]
        )
        return result.rows.map(row => this.transformRow(row))
    }

    async delete(id, projectId) {
        await this.db.query(
            `DELETE FROM bill WHERE id = $1 AND projectid = $2`,
            [id, projectId]
        )
    }

    transformRow(row) {
        if (!row) return null
        return new Bill(
            row.id,
            row.number,
            row.state,
            row.paymentlimitdate,
            row.paymenttype,
            row.paymentdate,
            row.note,
            row.projectid
        )
    }

    async findByIdWithDetails(id) {
        const result = await this.db.query(
            `SELECT b.*, c.email as customer_email, p.name as project_name,
            COALESCE(SUM(bl.quantity * bl.price), 0) as total
         FROM bill b
         INNER JOIN project p ON b.projectid = p.id
         INNER JOIN customer c ON p.customerid = c.id
         LEFT JOIN billline bl ON b.id = bl.billid
         WHERE b.id = $1
         GROUP BY b.id, b.number, b.state, b.paymentlimitdate, b.paymenttype,
                  b.paymentdate, b.note, b.projectid, c.email, p.name`,
            [id]
        )
        return this.transformRowWithDetails(result.rows[0])
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM bill WHERE id = $1`,
            [id]
        )
        return result.rows[0] || null
    }
    async findByProjectIdWithDetails(projectId) {
        const result = await this.db.query(
            `SELECT b.*, c.email as customer_email, p.name as project_name,
            COALESCE(SUM(bl.quantity * bl.price), 0) as total
         FROM bill b
         INNER JOIN project p ON b.projectid = p.id
         INNER JOIN customer c ON p.customerid = c.id
         LEFT JOIN billline bl ON b.id = bl.billid
         WHERE b.projectid = $1
         GROUP BY b.id, b.number, b.state, b.paymentlimitdate, b.paymenttype,
                  b.paymentdate, b.note, b.projectid, c.email, p.name
         ORDER BY b.number ASC`,
            [projectId]
        )
        return result.rows.map(row => this.transformRowWithDetails(row))
    }

    transformRowWithDetails(row) {
        if (!row) return null
        const bill = this.transformRow(row)
        bill.customerEmail = row.customer_email
        bill.projectName = row.project_name
        bill.total = parseFloat(row.total)
        return bill
    }
}