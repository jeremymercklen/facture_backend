module.exports = (app, quoteLineService, jwt) => {
    app.post('/quoteline', jwt.validateJWT, async (req, res) => {
        try {
            const quoteLine = await quoteLineService.create({
                text: req.body.text,
                quantity: req.body.quantity,
                price: req.body.price,
                quoteid: req.body.quoteid
            })
            res.json(quoteLine)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.put('/quoteline/:id', jwt.validateJWT, async (req, res) => {
        try {
            const quoteLine = await quoteLineService.update({
                id: parseInt(req.params.id),
                text: req.body.text,
                quantity: req.body.quantity,
                price: req.body.price,
                quoteid: req.body.quoteid
            })
            if (!quoteLine) {
                return res.status(404).json({error: 'Quote line not found'})
            }
            res.json(quoteLine)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.get('/quoteline/:id', jwt.validateJWT, async (req, res) => {
        try {
            const quoteLine = await quoteLineService.getById(parseInt(req.params.id))
            if (!quoteLine) {
                return res.status(404).json({error: 'Quote line not found'})
            }
            res.json(quoteLine)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.get('/quoteline/quote/:quoteId', jwt.validateJWT, async (req, res) => {
        try {
            const quoteLines = await quoteLineService.getByQuoteId(parseInt(req.params.quoteId))
            res.json(quoteLines)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.delete('/quoteline/:id', jwt.validateJWT, async (req, res) => {
        try {
            await quoteLineService.delete(parseInt(req.params.id), parseInt(req.body.quoteid))
            res.status(204).send()
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })
}