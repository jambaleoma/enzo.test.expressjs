const path = require('path');
const axios = require('axios');
const uuid = require('uuid/v4')

const getRegister = (req, res) => {
    console.log('Inside GET /register callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, '../../public/register.html'));
}

const createUser = (req, res) => {
    console.log('Inside POST /register callback')
    axios.get(`http://localhost:5000/users?username=${req.body.username}`)
        .then(resGet => {
            if (req.body.password !== req.body.password2) {
                console.log('Passwords do not match')
                return res.send('Le Password non corrispondono.\n')
            }
            const user = resGet.data[0]
            if (user) {
                console.log('User already Exist')
                return res.send('L\'Utente esiste già.\n')
            }
            console.log('Eseguo la post')
            axios.post(`http://localhost:5000/users`, {
                id: uuid(),
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            })
            .then(resPost => {
                const registeredUser = resPost.data[0]
                console.log(registeredUser)
                console.log('Correct Registration')
                return res.sendFile(path.resolve(__dirname, '../../public/registerNewCustomer.html'));
            }).catch(error => {
                console.log(error)
                return res.send('Errore durante l\'inserimento sul DB');
             })
        }).catch(error => {
            console.log(error)
            return res.send('Errore durante la ricerca dell\'utente sul DB');
         });
}

module.exports = {getRegister, createUser}