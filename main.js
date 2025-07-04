const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const UserService = require('./services/user')
const AddressService = require('./services/address')
const CustomerService = require('./services/customer')
const ProjectService = require('./services/project')
const QuoteService = require('./services/quote')
const QuoteLineService = require('./services/quoteline')
const BillService = require('./services/bill')
const BillLineService = require('./services/billline')

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

require('dotenv').config()

const dsn = process.env.CONNECTION_STRING
console.log(`Using database ${dsn}`)
const port = process.env.PORT || 3333;
const db = new pg.Pool({ connectionString:  dsn})
const addressService = new AddressService(db)
const userService = new UserService(db, addressService)
const customerService = new CustomerService(db)
const projectService = new ProjectService(db)
const quoteService = new QuoteService(db)
const quoteLineService = new QuoteLineService(db)
const billLineService = new BillLineService(db)
const billService = new BillService(db, billLineService)
const jwt = require('./jwt')(userService)
require('./api/user')(app, userService, addressService, jwt)
require('./api/customer')(app, customerService, addressService, jwt)
require('./api/project')(app, projectService, customerService, jwt)
require('./api/quote')(app, quoteService, jwt)
require('./api/quoteline')(app, quoteLineService, jwt)
require('./api/bill')(app, billService, billLineService, quoteLineService, jwt)
const seedDatabase = async () => require('./datamodel/seeder')(userService, addressService, customerService, projectService, quoteService, quoteLineService, billService, billLineService)
if (require.main === module) {
    seedDatabase().then( () =>
        app.listen(port, () =>
            console.log(`Listening on the port ${port}`)
        )
    )
}