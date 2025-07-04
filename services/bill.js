const BillDAO = require('../datamodel/billdao')
const Bill = require('../datamodel/bill')
const Quote = require('../datamodel/quote')

module.exports = class BillService {
    constructor(db, billLineService) {
        this.dao = new BillDAO(db)
        this.billLineService = billLineService
    }

    async createFromQuote(quote, billNumber, limitPaymentDate, note, quoteLines) {
        if (!billNumber || !limitPaymentDate || !quoteLines) {
            throw new Error('Quote, QuoteLines, bill number and payment limit date are required')
        }

        if (quote.state !== Quote.STATES.ACCEPTED) {
            throw new Error('Cannot create bill from a non-accepted quote')
        }

        const quoteDate = new Date(quote.date)
        const now = new Date()
        const diffTime = Math.abs(now - quoteDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays > 30) {
            throw new Error('Quote is more than 30 days old')
        }

        const bill = new Bill(
            null,
            billNumber,
            Bill.STATES.DRAFT,
            limitPaymentDate,
            null,
            null,
            note,
            quote.projectid
        )

        const createdBill = await this.dao.insert(bill)
        await this.billLineService.createManyFromQuoteLines(quoteLines, createdBill.id)
        return createdBill
    }

    async update(bill) {
        if (!bill.id || !bill.number || !bill.state || !bill.projectid) {
            throw new Error('Missing required fields')
        }
        if (!Object.values(Bill.STATES).includes(bill.state)) {
            throw new Error('Invalid state value')
        }

        // Vérifier l'état actuel de la facture
        const currentBill = await this.dao.findById(bill.id)
        if (currentBill.state === Bill.STATES.PAID) {
            throw new Error('Cannot modify a paid bill')
        }

        if (bill.state === Bill.STATES.PAID && (!bill.paymentdate || !bill.paymenttype)) {
            throw new Error('Payment date and payment type are required when state is paid')
        }
        return await this.dao.update(bill)
    }

    async getById(id) {
        if (!id) throw new Error('ID is required')
        return await this.dao.findByIdWithDetails(id)
    }

    async getByProjectId(projectId) {
        if (!projectId) throw new Error('Project ID is required')
        return await this.dao.findByProjectIdWithDetails(projectId)
    }
    async findLastProcessedBill(userId) {
        if (!userId) throw new Error('User ID is required')
        const result = await this.dao.findLastProcessedBill(userId)
        return result?.number || 1
    }
    async delete(id, quoteId) {
        if (!id || !quoteId) throw new Error('ID and Quote ID are required')
        await this.dao.delete(id, quoteId)
    }
}