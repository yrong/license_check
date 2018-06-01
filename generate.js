#!/usr/bin/env node

const crypto = require('./index')
const path = require('path')
const fs = require('fs')

let generateLicense = function() {
    let result = crypto.encrypt(fs.readFileSync(path.resolve('./license.json'), 'utf8'))
    let licenseFilePath = process.env.LICENSE_PATH + '/' + process.env.NODE_NAME + '.lic'
    fs.writeFileSync(licenseFilePath,result)
    console.log('license file generated in:'+licenseFilePath)
    return result
}

generateLicense()

module.exports = generateLicense