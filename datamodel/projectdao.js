const BaseDAO = require('./basedao')

module.exports = class ProjectDAO extends BaseDAO {
    constructor(db) {
        super(db, "project")
    }

    create() {
        return this.db.query(
            "CREATE TABLE project (id SERIAL PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, creationdate DATE NOT NULL, duedate DATE NOT NULL, customerid INT REFERENCES customer (id) NOT NULL, state VARCHAR(50) NOT NULL)"
        )
    }
}