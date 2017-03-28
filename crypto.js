var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

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


module.exports = {encrypt,decrypt}
