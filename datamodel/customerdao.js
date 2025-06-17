const BaseDAO = require('./basedao')

module.exports = class Customer extends BaseDAO {
    constructor(db) {
        super(db,"customer")
    }

    getAll() {
        return super.getAll()
    }
    create() {
        return( this.db.query("CREATE TABLE customer (id SERIAL PRIMARY KEY NOT NULL,iscompany BOOLEAN, name TEXT NOT NULL, addressid INT REFERENCES address (id) NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, userid INT REFERENCES user (id) NOT NULL)"))
    }
}