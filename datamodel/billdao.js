const BaseDAO = require('./basedao')

module.exports = class BillDAO extends BaseDAO {
    constructor(db) {
        super(db,"bill")
    }

    getAll() {
        return super.getAll()
    }
    create() {
        return this.db.query(`
        CREATE TYPE IF NOT EXISTS bill_state AS ENUM ('draft', 'edited', 'sent', 'paid');
        CREATE TABLE bill (
            id SERIAL PRIMARY KEY NOT NULL,
            number INT NOT NULL,
            state bill_state NOT NULL,
            creationdate DATE NOT NULL,
            projectid INT REFERENCES project (id) NOT NULL
        )`
        )
    }
}