const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');

// configure passport.js to use the local strategy for LOGIN
passport.use('login', new LocalStrategy({
        usernameField: 'username'
    },
    (username, password, done) => {
        console.log('Inside local strategy callback  for login')
        axios.get(`http://localhost:5000/users?username=${username}`)
            .then(res => {
                const user = res.data[0]
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
            })
            .catch(error => done(error));
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
    axios.get(`http://localhost:5000/users/${user.id}`)
        .then(res => done(null, res.data))
        .catch(error => done(error, false))
});

module.exports = {
    authenticateLogin
}