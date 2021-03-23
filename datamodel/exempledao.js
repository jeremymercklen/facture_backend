const BaseDAO = require('./basedao')

module.exports = class ExempleDAO extends BaseDAO {
    constructor(db) {
        super(db,"exemple")
    }
}