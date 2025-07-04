const QuoteLineDAO = require('../datamodel/quotelinedao')
const QuoteLine = require('../datamodel/quoteline')
module.exports = class QuoteLineService {
    constructor(db) {
        this.dao = new QuoteLineDAO(db)
    }

    async create(quoteLine) {
        if (!quoteLine.text || !quoteLine.quantity || !quoteLine.price || !quoteLine.quoteid) {
            throw new Error('Missing required fields')
        }
        return await this.dao.insert(quoteLine)
    }

    async update(quoteLine) {
        if (!quoteLine.id || !quoteLine.text || !quoteLine.quantity || !quoteLine.price || !quoteLine.quoteid) {
            throw new Error('Missing required fields')
        }
        return await this.dao.update(quoteLine)
    }

    async getById(id) {
        if (!id) throw new Error('ID is required')
        return await this.dao.findById(id)
    }

    async getByQuoteId(quoteId) {
        if (!quoteId) throw new Error('Quote ID is required')
        return await this.dao.findByQuoteId(quoteId)
    }

    async delete(id, quoteId) {
        if (!id || !quoteId) throw new Error('ID and Quote ID are required')
        await this.dao.delete(id, quoteId)
    }
}