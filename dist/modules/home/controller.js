const path = require('path');

const getHome = (req, res) => {
    console.log('Inside GET /home callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, '../../public/home.html'));
}

module.exports = {getHome}