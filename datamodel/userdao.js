const BaseDAO = require('./basedao')
const User = require('./user')

module.exports = class UserDAO extends BaseDAO {
    constructor(db) {
        super(db, "useraccount")
    }

    async createTable() {
        await this.db.query(`
            CREATE TABLE useraccount(
                id SERIAL PRIMARY KEY,
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                birthday DATE NOT NULL,
                addressid INTEGER REFERENCES address(id),
                email TEXT NOT NULL UNIQUE,
                phone INT NOT NULL,
                turnover NUMERIC NOT NULL,
                chargerate NUMERIC NOT NULL,
                challenge TEXT NOT NULL,
                isadmin BOOLEAN DEFAULT FALSE
            )
        `)
    }

    async insert(user) {
        const result = await this.db.query(
            `INSERT INTO useraccount(firstname, lastname, birthday, addressid, email, phone, turnover, chargerate, challenge, isadmin)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING id`,
            [user.firstname, user.lastname, user.birthday, user.addressid, user.email, user.phone, user.turnover, user.chargerate, user.challenge, user.isadmin]
        )
        return result.rows[0].id
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM useraccount WHERE id = $1`,
            [id]
        )
        if (result.rows.length === 0) {
            return null
        }
        const u = result.rows[0]
        return new User(u.id, u.firstname, u.lastname, u.birthday, u.addressid, u.email, u.phone, u.turnover, u.chargerate, u.challenge, u.isadmin)
    }

    async findByEmail(email) {
        const result = await this.db.query(
            `SELECT * FROM useraccount WHERE email = $1`,
            [email]
        )
        if (result.rows.length === 0) {
            return null
        }
        const u = result.rows[0]
        return new User(u.id, u.firstname, u.lastname, u.birthday, u.addressid,
            u.email, u.phone, u.turnover, u.chargerate, u.challenge, u.isadmin)
    }

    async findAll() {
        const result = await this.db.query('SELECT * FROM useraccount')
        return result.rows.map(u => new User(u.id, u.firstname, u.lastname, u.birthday, u.addressid, u.email, u.phone, u.turnover, u.chargerate, u.challenge, u.isadmin))
    }

    async update(user) {
        await this.db.query(
            `UPDATE useraccount
             SET firstname = $1, lastname = $2, birthday = $3, addressid = $4, email = $5, phone = $6, turnover = $7, chargerate = $8, challenge = $9, isadmin = $10
             WHERE id = $11`,
            [user.firstname, user.lastname, user.birthday, user.addressid, user.email, user.phone, user.turnover, user.chargerate, user.challenge, user.isadmin, user.id]
        )
    }

    async delete(id) {
        await this.db.query('DELETE FROM useraccount WHERE id = $1', [id])
    }
}