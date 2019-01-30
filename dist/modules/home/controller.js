const path = require('path');

const getHome = (req, res) => {
    console.log('Inside GET /home callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, '../../public/index2.html'));
}

module.exports = {getHome}