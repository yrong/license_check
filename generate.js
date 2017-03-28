#!/usr/bin/env node

const crypto = require('./index')
const path = require('path')
const fs = require('fs')

let generateLicense = function() {
    let licenseFilePath = process.env.licenseFilePath||path.resolve('./license.json')
    let result = crypto.encrypt(fs.readFileSync(licenseFilePath, 'utf8'))
    var package = require(path.resolve('./package.json'))
    licenseFilePath = path.resolve(licenseFilePath,`../${package.name}.lic`)
    fs.writeFileSync(licenseFilePath,result)
    console.log('license file generated in:'+licenseFilePath)
    return result
}

generateLicense()

module.exports = generateLicense

