require('rootpath')();
const express = require('express');
const path = require('path');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const http = require('http');
const cors = require('cors');
const flash = require('connect-flash');
const fs = require('fs');


function createServer({
    port,
    homeModule,
    errorModule,
    loginModule,
    registerModule,
    customerModule
}) {

    const app = express();
    // const htmlPage = fs.readFileSync('public/index.html', {
    //     encoding: 'utf8'
    // });

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
    app.use(customerModule.router)

    // Error Handling
    app.use(routes.errorHandler);

    app.get(/\/sdc\/.*/, routes.spaHandler);
    app.get('/maintainance', routes.spaHandler);
    app.get('/loginPCS', routes.pcsHandler);

    /** INITIAL CONFIGURATION ENDPOINT */
    app.get('/init-config', routes.initConfigHandler);
    app.use(express.static('public'));

    // create the homepage route at '/'
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, './public/home.html'))
    })

    // start server
    return {
        start(){
            httpServer.listen(port, function () {
                console.log(new Date() + ' - ' + 'Server listening on port ' + port);
            });
        }
    }

}

module.exports = {
    createServer
};