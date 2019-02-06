const {createServer} = require('./server')
const {getBucket} = require('./lib/couchbase')
const config = require('./config')
var couchbase = require('couchbase')

getBucket(config.couchbase)
    .then(bucket => {
        bucket.on('error', onCouchbaseFail)
        bucket.get('PCS_USERS', function (err, result) {
            if (err) {
                if (err.code == couchbase.errors.keyNotFound) {
                    console.log('Key does not exist');
                    bucket.insert('PCS_USERS', {}, function (err, result) {
                        if (!err) {
                            const CBresult = "stored document successfully. CAS is " + result.cas;
                            console.log(CBresult);
                        } else {
                            console.error("Couldn't store document: ", err);
                            reject(err);
                        }
                    })
                } else {
                    console.log('Some other error occurred: ', err);
                }
            }
        });

        const homeModule = require('./modules/home')
        const loginModule = require('./modules/login')({bucket});
        const registerModule = require('./modules/register');
        const errorModule = require('./modules/error');
        const customerModule = require('./modules/customer')

        return createServer({
            port: config.webServer.port,
            homeModule,
            errorModule,
            loginModule,
            registerModule,
            customerModule
        })

    })
    .then(server => server.start())
    .catch(onCouchbaseFail)

function onCouchbaseFail(err) {
    console.error(err)
    process.exit(1)
}