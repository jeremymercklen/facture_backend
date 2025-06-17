const Car = require('./user')

module.exports = (exempleService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await exempleService.dao.db.query("CREATE TABLE exemple(id SERIAL PRIMARY KEY, exemple TEXT NOT NULL)")
            // INSERTs
        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                reject(e)
            }
            return
        }
    })
}