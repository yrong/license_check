const should = require('should')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const license_helper = require('./index')

describe("license-helper", () => {

    it("generatelicense", () => {
        let result = license_helper.encrypt(fs.readFileSync(path.resolve('./license.json'), 'utf8'))
        result = JSON.parse(license_helper.decrypt(result))
        let expiration_date = moment(result.expiration), current = license_helper.now()
        should(expiration_date.isBefore(current)).be.exactly(true)
    });
})
