const crypto = require('./crypto')
const path = require('path')
const fs = require('fs')

let generateLicense = function() {
    let licenseFilePath = process.env.licenseFilePath||path.resolve('./license.json')
    let result = crypto.encrypt(fs.readFileSync(licenseFilePath, 'utf8'))
    var package = require(path.resolve('./package.json'))
    fs.writeFileSync(path.resolve(licenseFilePath,`../${package.name}.lic`),result)
    return result
}

module.exports = generateLicense

