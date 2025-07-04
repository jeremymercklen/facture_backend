const QuoteDAO = require('../datamodel/quotedao')
const Quote = require('../datamodel/quote')

module.exports = class QuoteService {
    constructor(db) {
        this.dao = new QuoteDAO(db)
    }

    async create(quote) {
        if (!quote.projectid) {
            throw new Error('Missing required fields')
        }
        return await this.dao.insert({
            ...quote,
            state: Quote.STATES.DRAFT
        })
    }

    async update(quote) {
        if (!quote.id || !quote.state || !quote.projectid) {
            throw new Error('Missing required fields')
        }
        if (!Object.values(Quote.STATES).includes(quote.state)) {
            throw new Error('Invalid state value')
        }
        return await this.dao.update(quote)
    }

    async getById(id) {
        if (!id) throw new Error('ID is required')
        return await this.dao.findById(id)
    }

    async getByProjectId(projectId) {
        if (!projectId) throw new Error('Project ID is required')
        return await this.dao.findByProjectId(projectId)
    }

    async delete(id, projectId) {
        if (!id || !projectId) throw new Error('ID and Project ID are required')
        await this.dao.delete(id, projectId)
    }
}