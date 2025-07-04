module.exports = function (app, svc, addressSvc, jwt) {
    app.post('/customer', jwt.validateJWT, async (req, res) => {
        const {iscompany, name, phone, email, line1, line2, line3, postalcode, city, country} = req.body

        if (!name || !phone || !email || !line1 || !postalcode || !city || !country) {
            return res.status(400).json({error: 'Missing required fields'})
        }

        try {
            const address = await addressSvc.insert(line1, line2, line3, postalcode, city, country)
            const customer = await svc.insert(
                iscompany,
                name,
                address.id,
                phone,
                email,
                req.user.id)

            res.json(customer)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    // Get customer by ID (only if owner)
    app.get('/customer/:id', jwt.validateJWT, async (req, res) => {
        try {
            const customer = await svc.findById(req.params.id)
            if (!customer || customer.userid !== req.user.id) {
                return res.sendStatus(403)
            }
            res.json(customer)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    // Get all customers for authenticated user
    app.get('/customers', jwt.validateJWT, async (req, res) => {
        try {
            const customers = await svc.findByUserId(req.user.id)
            res.json(customers)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    // Update customer (only if owner)
    app.put('/customer/:id', jwt.validateJWT, async (req, res) => {
        try {
            const existingCustomer = await svc.findById(req.params.id)
            if (!existingCustomer || existingCustomer.userid !== req.user.id) {
                return res.sendStatus(403)
            }
            const address = await addressSvc.update(
                existingCustomer.addressid,
                req.body.line1,
                req.body.line2,
                req.body.line3,
                req.body.postalcode,
                req.body.city,
                req.body.country
            )
            const customer = await svc.update({
                ...req.body,
                id: req.params.id,
                userid: req.user.id,
                addressid: address.id
            })
            res.json(customer)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    // Delete customer (only if owner)
    app.delete('/customer/:id', jwt.validateJWT, async (req, res) => {
        try {
            const existingCustomer = await svc.findById(req.params.id)
            if (!existingCustomer || existingCustomer.userid !== req.user.id) {
                return res.sendStatus(403)
            }
            await svc.delete(req.params.id)
            await addressSvc.delete(existingCustomer.addressid)
            res.sendStatus(204)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })
}