const express = require('express');
const app = express();
const path = require('path');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const loginModule = require('./modules/login');
const registerModule = require('./modules/register');
const errorModule = require('./modules/error');
const flash = require('connect-flash');

// add & configure middleware
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
    res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

// create the Customer's Profile routes
app.get('/customerProfile', (req, res) => {
    console.log('Inside GET /customerProfile callback')
    console.log(req.sessionID)
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.sendFile(path.resolve(__dirname, 'public/customerProfile.html'))
    } else {
        res.redirect('/')
    }
})

// create the Customer's Profile routes
app.get('/notLoggedUser', (req, res) => {
    console.log('Inside GET /notLoggedUser callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, 'public/notLoggedUser.html'))
})

// tell the server what port to listen on
app.listen(3000, () => {
    console.log('Listening on localhost:3000')
})