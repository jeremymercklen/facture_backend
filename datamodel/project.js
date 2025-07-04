// Project status enum
const ProjectStatus = {
    PROSPECT: 'prospect',
    STARTED: 'started',
    FINISHED: 'finished',
    CANCELED: 'canceled'
}

module.exports = class Project {
    constructor(id, name, status, customerid) {
        this.id = id
        this.name = name
        this.status = status
        this.customerid = customerid
    }

    static Status = ProjectStatus
}