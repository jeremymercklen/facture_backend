module.exports = class Address {
    constructor(id,line1, line2, line3, postalcode, city, country) {
        this.id = id
        this.line1 = line1
        this.line2 = line2
        this.line3 = line3
        this.postalcode = postalcode
        this.city = city
        this.country = country
    }
}