#!/usr/bin/env node

const license_helper = require('./index')


license_helper.generateLicense(process.env.LICENSE_PATH||'.',process.env.NODE_NAME||'node')

