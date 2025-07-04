module.exports = (app, billService, billLineService, quoteLineService, jwt) => {
    app.post('/bill/fromQuote/:quoteId', jwt.validateJWT, async (req, res) => {
        try {
            const bill = await billService.createFromQuote(
                {
                    ...req.body.quote
                },
                req.body.number,
                req.body.paymentlimitdate,
                req.body.note === undefined ? "" : req.body.note,
                await quoteLineService.getByQuoteId(parseInt(req.params.quoteId))
            )
            res.json(bill)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.get('/bill/lastProcessed', jwt.validateJWT, async (req, res) => {
        try {
            const bill = await billService.findLastProcessedBill(req.user.id)
            if (!bill) {
                return res.status(404).json({error: 'No processed bill found'})
            }
            res.json(bill)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.put('/bill/:id', jwt.validateJWT, async (req, res) => {
        try {
            const bill = await billService.update({
                id: parseInt(req.params.id),
                number: req.body.number,
                state: req.body.state,
                paymentlimitdate: req.body.paymentlimitdate,
                paymenttype: req.body.paymenttype,
                paymentdate: req.body.paymentdate,
                note: req.body.note,
                projectid: req.body.projectid
            })
            if (!bill) {
                return res.status(404).json({error: 'Bill not found'})
            }
            res.json(bill)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.get('/bill/:id', jwt.validateJWT, async (req, res) => {
        try {
            const bill = await billService.getById(parseInt(req.params.id))
            if (!bill) {
                return res.status(404).json({error: 'Bill not found'})
            }
            res.json(bill)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.get('/bill/project/:projectId', jwt.validateJWT, async (req, res) => {
        try {
            const bill = await billService.getByProjectId(parseInt(req.params.projectId))
            res.json(bill)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.delete('/bill/:id', jwt.validateJWT, async (req, res) => {
        try {
            await billService.delete(parseInt(req.params.id), parseInt(req.body.projectid))
            res.status(204).send()
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    // BillLines CRUD
    app.post('/billline', jwt.validateJWT, async (req, res) => {
        try {
            const billLine = await billLineService.create({
                text: req.body.text,
                quantity: req.body.quantity,
                price: req.body.price,
                billid: req.body.billid
            })
            res.json(billLine)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.put('/billline/:id', jwt.validateJWT, async (req, res) => {
        try {
            const billLine = await billLineService.update({
                id: parseInt(req.params.id),
                text: req.body.text,
                quantity: req.body.quantity,
                price: req.body.price,
                billid: req.body.billid
            })
            if (!billLine) {
                return res.status(404).json({error: 'Bill line not found'})
            }
            res.json(billLine)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.get('/billline/:id', jwt.validateJWT, async (req, res) => {
        try {
            const billLine = await billLineService.getById(parseInt(req.params.id))
            if (!billLine) {
                return res.status(404).json({error: 'Bill line not found'})
            }
            res.json(billLine)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.get('/billline/bill/:billId', jwt.validateJWT, async (req, res) => {
        try {
            const billLines = await billLineService.getByBillId(parseInt(req.params.billId))
            res.json(billLines)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.delete('/billline/:id', jwt.validateJWT, async (req, res) => {
        try {
            await billLineService.delete(parseInt(req.params.id), parseInt(req.body.billid))
            res.status(204).send()
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })
}