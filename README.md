# license-checker
=======

features including:

+ generate license based on aes or rsa algorithm
+ load license and check expiration from ntp server

### Install

```
npm install cmdb-license-checker
```

### Usage

#### generate license

just place a license.json in root project

```
{
    //required fields
    "expiration":"2017-04-30",
    //any other fields
    "mac":""
}
```

run command

```
generateLicense
```

> `${projectName}.lic` will be generated,projectName is the name field from npm.json

or specify encryption algorithm by running

```
encryption_algorithm=aes generateLicense
```


#### load license

```
const license_checker = require('cmdb-license-checker')
//load license when initialized
let license = license_checker.load(`./${projectName}.lic`)
//get license and time any time on the fly
let license = license_checker.getLicense()
let now = license_checker.now()
```

### License

MIT

