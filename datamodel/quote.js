module.exports = class Quote {
    static STATES = {
        DRAFT: 'draft',
        SENT: 'sent',
        ACCEPTED: 'accepted',
        REFUSED: 'refused'
    }

    constructor(id, state, creationdate, projectid) {
        this.id = id
        this.state = this.validateState(state)
        this.creationdate = creationdate
        this.projectid = projectid
    }

    validateState(state) {
        if (!Object.values(Quote.STATES).includes(state)) {
            throw new Error('Invalid quote state')
        }
        return state
    }
}