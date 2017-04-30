var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var moment = require('moment');
var sntp = require('sntp');

var encrypt_rsa = function(text) {
    var publicKey = fs.readFileSync(path.resolve(__dirname,'./key.pub'), "utf8");
    var buffer = new Buffer(text);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

var decrypt_rsa = function(text) {
    var privateKey = fs.readFileSync(path.resolve(__dirname,'./key'), "utf8");
    var buffer = new Buffer(text, "base64");
    var decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8");
};

var  algorithm = 'aes-256-ctr', password = 'd6F3Efeq';

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

let initialized = false,license

var load = (license_file_path)=>{
    if(!initialized){
        try{
            license = decrypt(fs.readFileSync(license_file_path, "utf8"))
            initialized = true
            license = JSON.parse(license)
        }catch(error){
            console.log('license invalid,please contact administrator')
            process.exit(-1)
        }
        if(license&&license.expiration){
            let expiration_date = moment(license.expiration),now = moment();
            sntp.start(function () {
                now = moment(sntp.now())
                if(expiration_date.isBefore(now)){
                    console.log('license expired,please contact administrator')
                    process.exit(-1)
                }
            });
        }
        return license
    }
}
var now = ()=>{return moment(sntp.now())}

var getLicense = ()=>{return license}

module.exports = {encrypt,decrypt,load,now,getLicense}
