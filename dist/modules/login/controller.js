const pt = require('../../lib/passport');
const path = require('path');

const getLogin = (req, res) => {
    console.log('Inside GET /login callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, '../../public/login.html'));
}

const postLogin = (req, res, next) => {
    console.log(req.body)
    console.log('Inside POST /login callback')
    pt.authenticateLogin(req, res, next);
}

const logoutUser = (req, res) => {
    console.log(req.body)
    console.log('Inside GET /logout callback')
    req.logout();
    if (req.isAuthenticated()) {
        res.send('NON HAI EFFETTUATO LA LOGOUT!')
    } else {
        res.send('USCITA EFFETTUATA CON SUCCESSO!')
    }
}

module.exports = {
    getLogin,
    postLogin,
    logoutUser
}