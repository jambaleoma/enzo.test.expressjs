const path = require('path');

const getError = (req, res) => {
    console.log('Inside GET /login callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, '../../public/notLoggedUser.html'));
}

module.exports = {
    getError
}