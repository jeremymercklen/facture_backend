const BaseDAO = require('./basedao')

module.exports = class BillLineDAO extends BaseDAO {
    constructor(db) {
        super(db, "billline")
    }

    create() {
        return this.db.query(
            "CREATE TABLE billline (id SERIAL PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, quantity INT NOT NULL, amount NUMERIC NOT NULL, billid INT REFERENCES bill (id) NOT NULL)"
        )
    }
}