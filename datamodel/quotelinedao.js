const BaseDAO = require('./basedao')

module.exports = class QuoteLineDAO extends BaseDAO {
    constructor(db) {
        super(db, "quoteline")
    }

    create() {
        return this.db.query(
            "CREATE TABLE quoteline (id SERIAL PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, quantity INT NOT NULL, amount NUMERIC NOT NULL, quoteid INT REFERENCES quote (id) NOT NULL)"
        )
    }
}