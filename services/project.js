const ProjectDAO = require('../datamodel/projectdao')
const Project = require('../datamodel/project')

module.exports = class ProjectService {
    constructor(db) {
        this.dao = new ProjectDAO(db)
    }

    async insert(name, customerid) {
        const project = new Project(null, name, Project.Status.PROSPECT, customerid)
        return await this.dao.insert(project)
    }

    async update(id, name, status, customerid) {
        const project = new Project(id, name, status, customerid)
        return await this.dao.update(project)
    }

    async findById(id) {
        return await this.dao.findById(id)
    }

    async findByUserIdWithCustomerInfo(userId, includeCustomer = false) {
        return await this.dao.findByUserIdWithCustomerInfo(userId)
    }

    async findByCustomerId(customerId) {
        return await this.dao.findByCustomerId(customerId)
    }

    async delete(id, customerId) {
        return await this.dao.delete(id, customerId)
    }
}