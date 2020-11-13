const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new localStrategy({
    usernameField: 'email'
    }, async (email, password, done) => {
// Match Password's User
        const user = await User.findOne({email: email});
        if(!user) {
            return done(null, false, { message: 'No user found.'});
        } else {
            const match = await user.matchPassword(password);
            if(match) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect Password.' });
            }
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });