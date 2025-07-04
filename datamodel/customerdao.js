const BaseDAO = require('./basedao')

module.exports = class CustomerDAO extends BaseDAO {
    constructor(db) {
        super(db, "customer")
    }

    async createTable() {
        return this.db.query(`
            CREATE TABLE customer (
            id SERIAL PRIMARY KEY NOT NULL,
            iscompany BOOLEAN,
            name TEXT NOT NULL,
            addressid INTEGER REFERENCES address (id) NOT NULL,
            phone INT NOT NULL,
            email TEXT NOT NULL,
            userid INTEGER REFERENCES useraccount (id) NOT NULL
            )
        `)
    }

    async insert(customer) {
        const { iscompany, name, addressid, phone, email, userid } = customer
        const result = await this.db.query(
            "INSERT INTO customer (iscompany, name, addressid, phone, email, userid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [iscompany, name, addressid, phone, email, userid]
        )
        return result.rows[0]
    }

    async update(customer) {
        const result = await this.db.query(
            "UPDATE customer SET iscompany=$1, name=$2, addressid=$3, phone=$4, email=$5 WHERE id=$6 AND userid=$7 RETURNING *",
            [customer.iscompany, customer.name, customer.addressid, customer.phone, customer.email, customer.id, customer.userid]
        )
        return result.rows[0]
    }

    async findById(id) {
        const result = await this.db.query(`
            SELECT c.*,
                   a.id as address_id,
                   a.line1,
                   a.line2,
                   a.line3,
                   a.country,
                   a.postalcode,
                   a.city
            FROM customer c
            JOIN address a ON c.addressid = a.id
            WHERE c.id = $1`,
            [id]
        )

        const row = result.rows[0]
        if (!row) return null

        return row;
    }

    async findByEmail(email) {
        const result = await this.db.query("SELECT * FROM customer WHERE email=$1", [email])
        return result.rows[0]
    }

    async findByUserId(userid) {
        const result = await this.db.query(`
                    SELECT c.id,
                           c.iscompany,
                           c.name,
                           c.phone,
                           c.email,
                           a.line1,
                           a.line2,
                           a.line3,
                           a.country,
                           a.postalcode,
                           a.city
                    FROM customer c
                             JOIN address a ON c.addressid = a.id
                    WHERE c.userid = $1`,
            [userid]
        )
        return result.rows
    }

    async findAll() {
        const result = await this.db.query("SELECT * FROM customer")
        return result.rows
    }

    async delete(id) {
        return this.db.query("DELETE FROM customer WHERE id=$1", [id])
    }
}