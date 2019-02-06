const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {getBucket} = require('./couchbase')
const config = require('./../config')

// configure passport.js to use the local strategy for LOGIN
passport.use('login', new LocalStrategy({
        usernameField: 'username'
    },
    (username, password, done) => {
        console.log('Inside local strategy callback  for login')
        getBucket(config.couchbase)
            .then(bucket => {
                bucket.get('PCS_USERS', function (err, result) {
                    if (err) {
                        if (err.code == couchbase.errors.keyNotFound) {
                            console.log('Key does not exist');
                        } else {
                            console.log('Some other error occurred: ', err);
                        }
                    } else {
                        bucket.lookupIn('PCS_USERS')
                            .get(username)
                            .execute(function (error, res) {
                                if (error) {
                                    console.log(error)
                                    // if (error.code == couchbase.errors.keyNotFound) {
                                    //     console.log('Key does not exist');
                                    // } else {
                                    //     console.log('Some other error occurred: ', error);
                                    // }
                                    return done(null, false, {
                                        message: error.message
                                    });
                                }
                                var user = res.content(username)
                                if (!user) {
                                    console.log('Invalid credentials')
                                    return done(null, false, {
                                        message: 'Invalid credentials.'
                                    });
                                }
                                if (password != user.password) {
                                    console.log('Invalid credentials')
                                    return done(null, false, {
                                        message: 'Invalid credentials.'
                                    });
                                }
                                console.log('Correct credentials')
                                return done(null, user);
                            });
                    }
                });
            })
    }
));

// Authenticate for LOGIN
const authenticateLogin = (req, res, next) => {
    console.log('Inside passport.authenticate() callback');
    const definedAuth = passport.authenticate('login', {
        successRedirect: '/customerProfile',
        failureRedirect: '/notLoggedUser',
        failureFlash: true
    });
    const authResult = definedAuth(req, res, next)
    return authResult
}

// tell passport how to serialize user
passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User is save to the session file store here')
    console.log(user)
    done(null, user);
});

// tell passport how to deserialize user
passport.deserializeUser((user, done) => {
    console.log('Inside deserializeUser callback')
    console.log(`The user passport saved in the session file store is: ${user.id}`)

    getBucket(config.couchbase)
        .then(bucket => {
            bucket.get('PCS_USERS', function (err, result) {
                bucket.lookupIn('PCS_USERS')
                    .get(user.username)
                    .execute(function (err, res) {
                        var userCB = res.content(user.username)
                        return done(null, userCB);
                    });
            });
        })
});

module.exports = {
    authenticateLogin
}