module.exports = (app, quoteService, jwt) => {
    app.post('/quote', jwt.validateJWT, async (req, res) => {
        try {
            const quote = await quoteService.create({
                projectid: req.body.projectid
            })
            res.json(quote)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.put('/quote/:id', jwt.validateJWT, async (req, res) => {
        try {
            const quote = await quoteService.update({
                id: parseInt(req.params.id),
                state: req.body.state,
                projectid: req.body.projectid
            })
            if (!quote) {
                return res.status(404).json({error: 'Quote not found'})
            }
            res.json(quote)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.get('/quote/:id', jwt.validateJWT, async (req, res) => {
        try {
            const quote = await quoteService.getById(parseInt(req.params.id))
            if (!quote) {
                return res.status(404).json({error: 'Quote not found'})
            }
            res.json(quote)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.get('/quote/project/:projectId', jwt.validateJWT, async (req, res) => {
        try {
            const quotes = await quoteService.getByProjectId(parseInt(req.params.projectId))
            res.json(quotes)
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })

    app.delete('/quote/:id', jwt.validateJWT, async (req, res) => {
        try {
            await quoteService.delete(parseInt(req.params.id), parseInt(req.body.projectid))
            res.status(204).send()
        } catch (e) {
            res.status(400).json({error: e.message})
        }
    })
}