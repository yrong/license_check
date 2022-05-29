const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const moment = require('moment')
const sntp = require('@hapi/sntp')

const encrypt_rsa = function(text) {
    var publicKey = fs.readFileSync(path.resolve(__dirname,'./key.pub'), "utf8");
    var buffer = new Buffer(text);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
}

const decrypt_rsa = function(text) {
    var privateKey = fs.readFileSync(path.resolve(__dirname,'./key'), "utf8");
    var buffer = new Buffer(text, "base64");
    var decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8");
}

const  algorithm = 'aes-256-ctr', password = 'd6F3Efeq';

function encrypt_aes(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt_aes(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

let encryption_algorithm = process.env.encryption_algorithm||'rsa',encrypt,decrypt
if(encryption_algorithm === 'rsa'){
    encrypt = encrypt_rsa
    decrypt = decrypt_rsa
}else{
    encrypt = encrypt_aes
    decrypt = decrypt_aes
}


const load = async (option)=>{
    let scirichon_license,license_file_path = option.path,license_content = option.content,
        apply = option.apply,ntp_server=option.ntpServer||"pool.ntp.org",timeout = option.timeout
    try{
        license_content = license_content || fs.readFileSync(license_file_path, "utf8")
        scirichon_license = JSON.parse(decrypt(license_content))
    }catch(error){
        throw new Error('license invalid,please contact administrator')
    }
    if(scirichon_license&&scirichon_license.expiration) {
        let expiration_date = moment(scirichon_license.expiration),now;
        try {
            let currentTime = await sntp.time({host: ntp_server, resolveReference: true,timeout: timeout||2500});
            now = moment(currentTime.originateTimestamp)
        } catch (error) {
            console.log('check license from ntp failed:' + error.message)
            now = moment()
        }
        if(apply){
            if (expiration_date.isBefore(now)) {
                console.log('license expired,please contact administrator')
                process.exit(-1)
            }
            global._scirichon_license = scirichon_license
        }

    }
    return scirichon_license
}

const now = ()=>{return moment(sntp.now())}

const getLicense = ()=>{return global._scirichon_license}

const license_middleware = (option) => {
    return async (ctx, next) => {
        let license = getLicense()
        let expiration_date = moment(license.expiration), current = now()
        if (expiration_date.isBefore(current)) {
            console.log('license expired,please contact administrator')
            process.exit(-1)
        }
        ctx.state.license = license
        await next();
    }
}

const generateLicense = function(dirPath,fileName) {
    let result = encrypt(fs.readFileSync(path.resolve('./license.json'), 'utf8'))
    let licenseFilePath = `${dirPath}/${fileName}.lic`
    fs.writeFileSync(licenseFilePath,result)
    console.log('license file generated in:'+licenseFilePath)
    return result
}

module.exports = {encrypt,decrypt,load,now,getLicense,license_middleware,generateLicense}
