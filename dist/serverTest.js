const express = require('express');
const app = express();
const path = require('path');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');

// configure passport.js to use the local strategy for LOGIN
passport.use('login', new LocalStrategy({
        usernameField: 'email'
    },
    (email, password, done) => {
        console.log('Inside local strategy callback')
        axios.get(`http://localhost:5000/users?email=${email}`)
            .then(res => {
                const user = res.data[0]
                if (!user) {
                    console.log('Invalid credentials')
                    return done(null, false, {
                        message: 'Invalid credentials.\n'
                    });
                }
                if (password != user.password) {
                    console.log('Invalid credentials')
                    return done(null, false, {
                        message: 'Invalid credentials.\n'
                    });
                }
                console.log('Correct credentials')
                return done(null, user);
            })
            .catch(error => done(error));
    }
));

// configure passport.js to use the local strategy FOR REGISTER
passport.use('register', new LocalStrategy({
        usernameField: 'email'
    },
    (email, password, password2, done) => {
        console.log('Inside local strategy callback')
        axios.get(`http://localhost:5000/users?email=${email}`)
            .then(res => {
                const user = res.data[0]
                if (user) {
                    console.log('User already Exist')
                    return done(null, false, {
                        message: 'L\'Utente esiste già.\n'
                    });
                }
                if (password != password2) {
                    console.log('Passwords do not match')
                    return done(null, false, {
                        message: 'Le Password non corrispondono.\n'
                    });
                }
                axios.post(`http://localhost:5000/users`, {
                        id: '00000001',
                        email: email,
                        password: password
                    })
                    .then(res => {
                        const registeredUser = res.data[0]
                        console.log(registeredUser)
                        console.log('Correct Registration')
                    }).catch(error => done(error));
                return done(null, user);
            })
            .catch(error => done(error));
    }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here')
    console.log(user.id)
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('Inside deserializeUser callback')
    console.log(`The user id passport saved in the session file store is: ${id}`)
    axios.get(`http://localhost:5000/users/${id}`)
        .then(res => done(null, res.data))
        .catch(error => done(error, false))
});

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

// create the homepage route at '/'
app.get('/', (req, res) => {
    console.log('Inside the homepage callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

// create the login get and post routes
app.get('/login', (req, res) => {
    console.log('Inside GET /login callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, 'public/login.html'));
})

app.post('/login', (req, res, next) => {
    console.log(req.body)
    console.log('Inside POST /login callback')
    passport.authenticate('login', (err, user, info) => {
        console.log('Inside passport.authenticate() callback');
        console.log('req.session.passport: ' + req.session.passport)
        console.log('req.user: ' + req.user)
        if (info) {
            return res.send(info.message)
        }
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/notLoggedUser');
        }
        req.login(user, (err) => {
            console.log('Inside req.login() callback')
            console.log('req.session.passport: ' + req.session.passport)
            if (err) {
                return next(err);
            }
            return res.redirect('/customerProfile');
        })
    })(req, res, next);
})

app.get('/authrequired', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ${req.isAuthenticated()}`)
    if (req.isAuthenticated()) {
        res.send('you hit the authentication endpoint\n')
    } else {
        res.redirect('/')
    }
})

// create the login get and post routes
app.get('/customerProfile', (req, res) => {
    console.log('Inside GET /customerProfile callback')
    console.log(req.sessionID)
    console.log(req.session.user)
    res.sendFile(path.resolve(__dirname, 'public/customerProfile.html'));
})

// create the register get and post routes
app.get('/register', (req, res) => {
    console.log('Inside GET /register callback')
    console.log(req.sessionID)
    res.sendFile(path.resolve(__dirname, 'public/register.html'));
})

app.post('/register', (req, res, next) => {
    console.log(req.body)
    console.log('Inside POST /register callback')
    passport.authenticate('redf', (err, user, info) => {
        console.log('Inside passport.authenticate() callback');
        console.log('req.session.passport: ' + req.session.passport)
        console.log('req.user: ' + req.user)
        if (info) {
            return res.send(info.message)
        }
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/notLoggedUser');
        }
        req.login(user, (err) => {
            console.log('Inside req.login() callback')
            console.log('req.session.passport: ' + req.session.passport)
            if (err) {
                return next(err);
            }
            return res.redirect('/customerProfile');
        })
    })(req, res, next);
})

// tell the server what port to listen on
app.listen(3000, () => {
    console.log('Listening on localhost:3000')
})