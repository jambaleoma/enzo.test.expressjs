const path = require('path');
const fs = require('fs');

const getCustomerProfile = (req, res) => {
    console.log('Inside GET /customerProfile callback')
    console.log(req.sessionID)

    res.sendFile(path.resolve(__dirname, '../../public/customerProfile.html'));
}

const getNotLoggedCustomer = (req, res) => {
    console.log('Inside GET /notLoggedCustomer callback')
    console.log(req.sessionID)

    res.sendFile(path.resolve(__dirname, '../../public/notLoggedUser.html'));
}

const getLogOutCustomer = (req, res) => {

    const htmlPage = fs.readFileSync('public/index.html', {
        encoding: 'utf8'
    });

    console.log(req.body)
    console.log('Inside GET /logout callback')
    var regex2 = new RegExp('{{.+}}');
    const htmlBody = htmlPage.replace(regex2, '{{ID_NOT_LOGGED}}');
    fs.writeFileSync('public/index.html', htmlBody);
    req.logout();
    if (req.isAuthenticated()) {
        res.send('NON HAI EFFETTUATO LA LOGOUT!')
    } else {
        res.send('USCITA EFFETTUATA CON SUCCESSO!')
    }
}

module.exports = {
    getCustomerProfile,
    getNotLoggedCustomer,
    getLogOutCustomer
}