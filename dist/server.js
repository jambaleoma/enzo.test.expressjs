require('rootpath')();
const express = require('express');
const app = express();
const path = require('path');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const homeModule = require('./modules/home')
const loginModule = require('./modules/login');
const registerModule = require('./modules/register');
const errorModule = require('./modules/error');
const flash = require('connect-flash');
const fs = require('fs');
const htmlPage = fs.readFileSync('public/index.html', {
    encoding: 'utf8'
});

const http = require('http');
const cors = require('cors');

const routes = require('./routes');

var httpServer = http.createServer(app);
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(session({
    genid: (req) => {
        console.log('Inside session middleware genid function')
        console.log('Request object sessionID from client:\n' + req.sessionID)
        return uuid()
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// binding the submodules routes for app
app.use(loginModule.router)
app.use(registerModule.router)
app.use(errorModule.router)
app.use(homeModule.router)

// Error Handling
app.use(routes.errorHandler);

app.get(/\/sdc\/.*/, routes.spaHandler);
app.get('/maintainance', routes.spaHandler);
app.get('/loginPCS', routes.pcsHandler);

// create the Customer's LOGOUT routes
app.get('/forms_O2C/logoff.fcc', (req, res) => {
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
})

/** INITIAL CONFIGURATION ENDPOINT */
app.get('/init-config', routes.initConfigHandler);
app.use(express.static('public'));
// console.log("process.env", process.env);

// create the Customer's Authentication routes
app.get('/authrequired', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ` + (req.isAuthenticated() ? 'Yes' : 'No'))
    if (req.isAuthenticated()) {
        res.send('SI SEI AUTENTICATO')
    } else {
        res.redirect('/')
    }
})

// create the homepage route at '/'
app.get('/', (req, res) => {
    console.log('Inside the homepage callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, './public/index2.html'))
})

// create the Customer's Profile routes
app.get('/customerProfile', (req, res) => {
    console.log('Inside GET /customerProfile callback')
    console.log(req.sessionID)
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.sendFile(path.resolve(__dirname, './public/customerProfile.html'))
    } else {
        res.redirect('/')
    }
})

// create the Customer's Profile routes
app.get('/notLoggedUser', (req, res) => {
    console.log('Inside GET /notLoggedUser callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, './public/notLoggedUser.html'))
})

// start server
var port = process.env.NODE_ENV === 'production' ? 3000 : 3000;
httpServer.listen(port, function () {
    console.log(new Date() + ' - ' + 'Server listening on port ' + port);
});
