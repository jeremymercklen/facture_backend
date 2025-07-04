const BillLineDAO = require('../datamodel/billlinedao')
const BillLine = require('../datamodel/billline')

module.exports = class BillLineService {
    constructor(db) {
        this.dao = new BillLineDAO(db)
    }

    async create(billLine) {
        if (!billLine.text || !billLine.quantity || !billLine.price || !billLine.billid) {
            throw new Error('Missing required fields')
        }
        return await this.dao.insert(billLine)
    }

    async createFromQuoteLine(quoteLine, billId) {
        if (!quoteLine || !billId) {
            throw new Error('QuoteLine and Bill ID are required')
        }
        const billLine = new BillLine(
            null,
            quoteLine.text,
            quoteLine.quantity,
            quoteLine.price,
            billId
        )
        return await this.dao.insert(billLine)
    }

    async createManyFromQuoteLines(quoteLines, billId) {
        if (!quoteLines || !billId) {
            throw new Error('QuoteLines and Bill ID are required')
        }
        const billLines = []
        for (const quoteLine of quoteLines) {
            const billLine = await this.createFromQuoteLine(quoteLine, billId)
            billLines.push(billLine)
        }
        return billLines
    }

    async update(billLine) {
        if (!billLine.id || !billLine.text || !billLine.quantity || !billLine.price || !billLine.billid) {
            throw new Error('Missing required fields')
        }
        return await this.dao.update(billLine)
    }

    async getById(id) {
        if (!id) throw new Error('ID is required')
        return await this.dao.findById(id)
    }

    async getByBillId(billId) {
        if (!billId) throw new Error('Bill ID is required')
        return await this.dao.findByBillId(billId)
    }

    async delete(id, billId) {
        if (!id || !billId) throw new Error('ID and Bill ID are required')
        await this.dao.delete(id, billId)
    }
}