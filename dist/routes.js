const fs = require('fs');
const path = require('path');

const Errors = require('./models/Errors');

const htmlPage = fs.readFileSync('public/index.html', {
    encoding: 'utf8'
});

function pcsHandler(req, response) {
    var regex2 = new RegExp('{{.+}}');
    const htmlBody = htmlPage.replace(regex2, '{{ID_NOT_LOGGED}}');
    fs.writeFileSync('public/index.html', htmlBody);
    /* check PCS */
    let employeeId = req.user.username;
    let firstName = req.user.firstName;
    let lastName = req.user.lastName;

    console.log(employeeId);
    console.log(req.user);
   
    if (employeeId && req.isAuthenticated()) {
        console.log(new Date() + ' - ' + 'Login via PCS in corso....');
        const htmlBody = htmlPage.replace('{{ID_NOT_LOGGED}}', '{{' + employeeId + '-' + firstName + '-' + lastName + '}}');
        fs.writeFileSync('public/index.html', htmlBody);
        console.log(new Date() + ' - ' + 'Login terminato con successo.');
    }
    else{
        console.log(new Date() + ' - ' + 'Login via PCS in corso....');
        console.log(new Date() + ' - ' + 'ERRORE: Campo obbligatorio UID assente nella richiesta di PCS');
    }
    response.sendFile(path.resolve(__dirname, 'public/index.html'));
}

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
function spaHandler(req, resp) {
    resp.sendFile(path.resolve(__dirname, 'public/index.html'));
}

function initConfigHandler(req, resp) {
    const configEnv = {};
    configEnv.baseApiUrl = process.env.SDC_API_BASE_URL || 'http://localhost:8080';
    resp.json(configEnv);
}


function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.log('handling error', err);
    if (err instanceof Errors.IError) {
        res.status(err.code).json(err);
    } else {
        res.status(500).json(new Errors.InternalServerError((err || '').toString()));
    }
}
module.exports.pcsHandler=pcsHandler;
module.exports.spaHandler=spaHandler;
module.exports.initConfigHandler=initConfigHandler;
module.exports.errorHandler=errorHandler;