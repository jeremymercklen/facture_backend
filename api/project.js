const Project = require('../datamodel/project')
module.exports = function (app, projectSvc, customerSvc, jwt) {
    // Create project
    app.post('/project', jwt.validateJWT, async (req, res) => {
        const { name, customerid } = req.body

        if (!name || !customerid) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        try {
            const project = await projectSvc.insert(name, customerid)
            res.status(201).json(project)
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    })

    // Get project by ID
    app.get('/project/:id', jwt.validateJWT, async (req, res) => {
        try {
            const project = await projectSvc.findById(req.params.id)
            if (!project) {
                return res.status(404).json({ error: 'Project not found' })
            }
            res.json(project)
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    })

    // Get all projects by customer ID
    app.get('/projects/customer/:customerId', jwt.validateJWT, async (req, res) => {
        try {
            const projects = await projectSvc.findByCustomerId(req.params.customerId)
            res.json(projects)
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    })

    // Get all projects for user's customers
    app.get('/projects/user', jwt.validateJWT, async (req, res) => {
        try {
            const includeCustomer = req.query.includeCustomer === 'true'
            const projects = await projectSvc.findByUserIdWithCustomerInfo(req.user.id, includeCustomer)
            res.json(projects)
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    })

    // Update project
    app.put('/project/:id', jwt.validateJWT, async (req, res) => {
        const { name, status, customerid } = req.body

        if (!name || !status) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        try {
            // Validate status
            if (!Object.values(Project.Status).includes(status)) {
                return res.status(400).json({ error: 'Invalid status value' })
            }

            const project = await projectSvc.update(req.params.id, name, status, customerid)
            res.json(project)
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    })

    // Delete project
    app.delete('/project/:id', jwt.validateJWT, async (req, res) => {
        try {
            // Get the project first
            const project = await projectSvc.findById(req.params.id)
            if (!project) {
                return res.status(404).json({ error: 'Project not found' })
            }

            // Get the customer to verify ownership
            const customers = await customerSvc.findByUserId(req.user.id)
            const customerIds = customers.map(c => c.id)

            // Check if the project's customer belongs to the authenticated user
            if (!customerIds.includes(project.customerid)) {
                return res.status(403).json({ error: 'Not authorized to delete this project' })
            }

            await projectSvc.delete(req.params.id, project.customerid)
            res.sendStatus(204)
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    })
}