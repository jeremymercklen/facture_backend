const bcrypt = require('bcrypt')
const UserDAO = require('../datamodel/userdao')
const User = require('../datamodel/user')

module.exports = class UserService {
    constructor(db, addressService) {
        this.dao = new UserDAO(db)
        this.addressService = addressService
    }

    hashPassword(password) {
        return bcrypt.hashSync(password, 10)
    }

    async insert(firstname, lastname, birthday, addressid, email, phone, turnover, chargerate, password, isadmin = false) {
        const existingUser = await this.dao.findByEmail(email)
        if (!existingUser) {
            const challenge = this.hashPassword(password)
            const user = new User(null, firstname, lastname, birthday, addressid,
                email, phone, turnover, chargerate, challenge, isadmin)
            return this.dao.insert(user)
        }
        return null
    }

    async validatePassword(email, password) {
        const user = await this.dao.findByEmail(email.trim())
        if (user && this.comparePassword(password, user.challenge)) {
            return user
        }
        return null
    }

    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }

    async findByEmail(email) {
        return this.dao.findByEmail(email)
    }

    async findById(id) {
        return this.dao.findById(id)
    }

    async findByIdWithAddress(id) {
        const user = await this.dao.findById(id)
        if (!user) {
            return null
        }
        // Assuming addressSvc is passed to the constructor
        if (user.addressid) {
            user.address = await this.addressService.findById(user.addressid)
            delete user.addressid
        }
        return user
    }


    async findAll() {
        return this.dao.findAll()
    }

    async update(userId, userData) {
        // Get current user data
        const currentUser = await this.dao.findById(userId)
        if (!currentUser) {
            throw new Error('User not found')
        }

        // Prepare update data with all required fields
        const updatedData = {
            id: userId,
            firstname: userData.firstname || currentUser.firstname,
            lastname: userData.lastname || currentUser.lastname,
            birthday: userData.birthday || currentUser.birthday,
            addressid: userData.addressid || currentUser.addressid,
            email: userData.email || currentUser.email,
            phone: userData.phone || currentUser.phone,
            turnover: userData.turnover || currentUser.turnover,
            chargerate: userData.chargerate || currentUser.chargerate,
            challenge: currentUser.challenge,
            isadmin: currentUser.isadmin
        }

        return await this.dao.update(updatedData)
    }

    async updateUserAddress(userId, addressData) {
        const user = await this.dao.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }

        let addressId = user.addressid
        if (!addressId) {
            // Create new address if user doesn't have one
            const address = await this.addressService.insert(
                addressData.line1,
                addressData.line2,
                addressData.line3,
                addressData.postalcode,
                addressData.city,
                addressData.country
            )
            addressId = address.id
        } else {
            // Update existing address
            await this.addressService.update(
                addressId,
                addressData.line1,
                addressData.line2,
                addressData.line3,
                addressData.postalcode,
                addressData.city,
                addressData.country
            )
        }

        // Update user with new address if needed
        if (user.addressid !== addressId) {
            await this.update(userId, { addressid: addressId })
        }

        return this.findByIdWithAddress(userId)
    }

    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.dao.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }

        const isValidPassword = this.comparePassword(oldPassword, user.challenge)
        if (!isValidPassword) {
            throw new Error('Invalid current password')
        }

        const updatedUser = {
            ...user,
            challenge: this.hashPassword(newPassword)
        }

        return await this.dao.update(updatedUser)
    }

    async delete(id) {
        return this.dao.delete(id)
    }
}