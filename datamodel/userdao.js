const BaseDAO = require('./basedao')
const User = require('./user')

module.exports = class UserDAO extends BaseDAO {
    constructor(db) {
        super(db, "user")
    }

    create() {
        return this.db.query(
            "CREATE TABLE user (id SERIAL PRIMARY KEY NOT NULL, firstname TEXT NOT NULL, lastname TEXT NOT NULL, birthday DATE NOT NULL, addressid INT REFERENCES address (id) NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, turnover INT NOT NULL, chargerate INT NOT NULL, challenge TEXT NOT NULL, isadmin BOOLEAN NOT NULL DEFAULT FALSE)"
        )
    }

    async insert(user) {
        const result = await this.db.query(
            `INSERT INTO user(firstname, lastname, birthday, addressid, email, phone, turnover, chargerate, challenge, isadmin)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING id`,
            [user.firstname, user.lastname, user.birthday, user.addressid, user.email, user.phone, user.turnover, user.chargerate, user.challenge, user.isadmin]
        )
        return result.rows[0].id
    }

    async findById(id) {
        const result = await this.db.query(
            `SELECT * FROM user WHERE id = $1`,
            [id]
        )
        if (result.rows.length === 0) {
            return null
        }
        const u = result.rows[0]
        return new User(u.id, u.firstname, u.lastname, u.birthday, u.addressid, u.email, u.phone, u.turnover, u.chargerate, u.challenge, u.isadmin)
    }

    async findAll() {
        const result = await this.db.query('SELECT * FROM user')
        return result.rows.map(u => new User(u.id, u.firstname, u.lastname, u.birthday, u.addressid, u.email, u.phone, u.turnover, u.chargerate, u.challenge, u.isadmin))
    }

    async update(user) {
        await this.db.query(
            `UPDATE user
             SET firstname = $1, lastname = $2, birthday = $3, addressid = $4, email = $5, phone = $6, turnover = $7, chargerate = $8, challenge = $9, isadmin = $10
             WHERE id = $11`,
            [user.firstname, user.lastname, user.birthday, user.addressid, user.email, user.phone, user.turnover, user.chargerate, user.challenge, user.isadmin, user.id]
        )
    }

    async delete(id) {
        await this.db.query('DELETE FROM user WHERE id = $1', [id])
    }
}