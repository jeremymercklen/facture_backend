const {Status} = require("./project");
module.exports = (userService, addressService, customerService, projectService, quoteService, quoteLineService, billService, billLineService) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Drop tables in correct order
            await billLineService.dao.db.query('DROP TABLE IF EXISTS billline')
            await billService.dao.db.query('DROP TABLE IF EXISTS bill')
            await quoteLineService.dao.db.query('DROP TABLE IF EXISTS quoteline')
            await quoteService.dao.db.query('DROP TABLE IF EXISTS quote')
            await projectService.dao.db.query('DROP TABLE IF EXISTS project')
            await addressService.dao.db.query('DROP TABLE IF EXISTS customer')
            await addressService.dao.db.query('DROP TABLE IF EXISTS useraccount')
            await addressService.dao.db.query('DROP TABLE IF EXISTS address')

            // Create tables in correct order
            await addressService.dao.createTable()
            await userService.dao.createTable()
            await customerService.dao.createTable()
            await projectService.dao.createTable()
            await quoteService.dao.createTable()
            await quoteLineService.dao.createTable()
            await billService.dao.createTable()
            await billLineService.dao.createTable()

            // Create default admin user with address
            const adminAddress = await addressService.insert(
                '1 Admin Street',
                null,
                null,
                '75000',
                'Paris',
                'France'
            )

            const admin = await userService.insert(
                'Admin',
                'User',
                '1990-01-01',
                adminAddress.id,
                'admin@example.com',
                '0123456789',
                0,
                0,
                'admin123',
                true
            )

            // Create sample customer addresses
            const customerAddress1 = await addressService.insert(
                '10 Business Road',
                null,
                null,
                '75001',
                'Paris',
                'France'
            )

            const customerAddress2 = await addressService.insert(
                '20 Commerce Street',
                null,
                null,
                '75002',
                'Paris',
                'France'
            )

            // Create sample customers
            const customer1 = await customerService.insert(
                true, // iscompany
                'Tech Corp',
                customerAddress1.id,
                '0123456789',
                'techcorp@example.com',
                admin
            )

            const customer2 = await customerService.insert(
                false, // iscompany
                'John Doe',
                customerAddress2.id,
                '0987654321',
                'john.doe@example.com',
                admin
            )

            const project1 = await projectService.insert(
                'Website Redesign',
                customer1.id
            )

            const project2 = await projectService.insert(
                'Mobile App Development',
                customer1.id
            )

            const project3 = await projectService.insert(
                'Personal Portfolio',
                customer2.id
            )

            // Create sample quotes
            const quote1 = await quoteService.create({
                number: 'DEV-2024-001',
                state: 'draft',
                projectid: project1.id
            })

            const quote2 = await quoteService.create({
                number: 'DEV-2024-002',
                state: 'sent',
                projectid: project2.id
            })

            // Create sample quote lines
            await quoteLineService.create({
                text: 'Homepage design',
                quantity: 1,
                price: 1500,
                quoteid: quote1.id
            })

            await quoteLineService.create({
                text: 'Contact form implementation',
                quantity: 1,
                price: 500,
                quoteid: quote1.id
            })

            await quoteLineService.create({
                text: 'UI/UX Design',
                quantity: 1,
                price: 2000,
                quoteid: quote2.id
            })

        } catch (e) {
            reject(e)
            return
        }
        resolve()
    })
}