const path = require('path');
const uuid = require('uuid/v4')
const {
    getBucket
} = require('./../../lib/couchbase')
const config = require('./../../config')

const getRegister = (req, res) => {
    console.log('Inside GET /register callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, '../../public/register.html'));
}

const createUser = (req, res) => {
    console.log('Inside POST /register callback')

    getBucket(config.couchbase)
        .then(bucket => {
            bucket.on('error', onCouchbaseFail)

            bucket
                .mutateIn('PCS_USERS')
                .insert(req.body.username, {
                    'id': uuid(),
                    'username': req.body.username,
                    'password': req.body.password,
                    'firstName': req.body.firstName,
                    'lastName': req.body.lastName
                })
                .execute(function (err, result) {
                    if (!err) {
                        const CBresult = "stored document successfully. CAS is " + result.cas;
                        console.log(CBresult);
                        console.log('Correct Registration')
                        return res.send('Registrazione Effettuata con Successo!');
                    } else {
                        console.error("Couldn't store document: ", err);
                        reject(err);
                    }
                })
        }).catch(error => {
            console.log(error)
            return res.send('Errore durante la ricerca dell\'utente sul DB');
        });
}

function onCouchbaseFail(err) {
    console.error(err)
    process.exit(1)
}

module.exports = {
    getRegister,
    createUser
}