const jwt = require('jsonwebtoken')
const jwtKey = process.env.JWT_KEY
const jwtExpirySeconds = 3600

module.exports = (userAccountService) => {
    return {
        validateJWT(req, res, next) {
            if (req.headers.authorization === undefined) {
                return res.status(401).json({ message: 'Missing authorization header' })
            }
            if (!req.headers.authorization.startsWith("Bearer ")) {
                return res.status(400).json({ message: 'Invalid authorization format' })
            }
            const token = req.headers.authorization.split(" ")[1]

            jwt.verify(token, jwtKey, {algorithm: "HS256"}, async (err, user) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: 'Token expired' })
                    }
                    if (err.name === 'JsonWebTokenError') {
                        return res.status(401).json({ message: 'Invalid token' })
                    }
                    return res.status(401).json({ message: 'Token verification failed' })
                }

                try {
                    req.user = await userAccountService.dao.findById(user.userId)
                    if (req.user == null) {
                        return res.status(401).json({ message: 'User not found' })
                    }
                    return next()
                } catch(e) {
                    return res.status(401).json({ message: 'Database error during authentication' })
                }
            })
        },
        generateJWT(userId) {
            return jwt.sign({userId}, jwtKey, {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
            })
        }
    }
}