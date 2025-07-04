module.exports = (app, svc, addressSvc, jwt) => {
    // Authentication routes
    app.post('/user/authenticate', async (req, res) => {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' })
        }

        try {
            const user = await svc.validatePassword(email, password)
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' })
            }

            console.log(`${user.email} authenticated`)
            res.json({
                id: user.id,
                email: user.email,
                isadmin: user.isadmin,
                token: jwt.generateJWT(user.id)
            })
        } catch (e) {
            console.log('Authentication error:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    })

    app.get("/user/refreshtoken", jwt.validateJWT, (req, res) => {
        console.log('Refreshing token for user:', req.user.id)
        res.json({
            token: jwt.generateJWT(req.user.id)
        })
    })

    app.put("/user/address", jwt.validateJWT, async (req, res) => {
        try {
            const user = await svc.updateUserAddress(req.user.id, {
                line1: req.body.line1,
                line2: req.body.line2,
                line3: req.body.line3,
                postalcode: req.body.postalcode,
                city: req.body.city,
                country: req.body.country
            })

            delete user.challenge
            res.json(user)
        } catch (e) {
            console.log('Error updating user address:', e)
            res.status(400).json({ error: e.message })
        }
    })

    app.put("/user/changepassword", jwt.validateJWT, async (req, res) => {
        try {
            if (!req.body.oldPassword || !req.body.newPassword) {
                return res.status(400).json({ message: 'Missing old or new password' })
            }

            const user = await svc.changePassword(
                req.user.id,
                req.body.oldPassword,
                req.body.newPassword
            )

            res.json(user)
        } catch (e) {
            console.log('Error changing password:', e)
            res.status(400).json({ error: e.message })
        }
    })

    app.post('/user', async (req, res) => {
        const {
            firstname, lastname, birthday, email, phone,
            turnover, chargerate, password,
            line1, line2, line3, postalcode, city, country
        } = req.body

        if (!firstname || !lastname || !birthday || !email ||
            !phone || turnover === undefined || chargerate === undefined ||
            !password || !line1 || !postalcode || !city || !country) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        try {
            const existingUser = await svc.findByEmail(email)
            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists' })
            }

            console.log('Creating new user:', email)
            const address = await addressSvc.insert(line1, line2, line3, postalcode, city, country)
            const userId = await svc.insert(
                firstname, lastname, birthday, address.id,
                email, phone, turnover, chargerate, password
            )

            res.status(201).json({ token: jwt.generateJWT(userId) })
        } catch (e) {
            console.log('User creation error:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    })

    app.put("/user", jwt.validateJWT, async (req, res) => {
        try {
            const user = await svc.update(req.user.id, {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                birthday: req.body.birthday,
                addressid: req.body.addressid,
                email: req.body.email,
                phone: req.body.phone,
                turnover: req.body.turnover,
                chargerate: req.body.chargerate
            })

            res.json(user)
        } catch (e) {
            console.log('Error updating user:', e)
            res.status(400).json({ error: e.message })
        }
    })

    app.get("/user", jwt.validateJWT, async (req, res) => {
        try {
            console.log('Fetching current user:', req.user.id)
            const user = await svc.findByIdWithAddress(req.user.id)

            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            delete user.challenge
            res.json(user)
        } catch (e) {
            console.log('Error fetching user:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    })

    app.get("/users", jwt.validateJWT, async (req, res) => {
        try {
            console.log('Fetching all users')
            if (!req.user.isadmin) {
                return res.status(403).json({ message: 'Unauthorized access' })
            }

            const users = await svc.findAll()
            users.forEach(user => delete user.challenge)
            res.json(users)
        } catch (e) {
            console.log('Error fetching users:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    })
}