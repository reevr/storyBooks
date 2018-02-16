const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

//User model
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, (accesToken, refreshToken, profile, done) => {
        // console.log(accesToken);
        // console.log(profile);

        User.findOne({
            googleID: profile.id
        }).then(user => {
            if (user) {
                done(null, user);
            } else {
                // Create user
                const newUser = {
                    googleID: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    image: image
                };
                new User(newUser)
                .save()
                .then(user => done(null, user));
            }
        });

        // removing extra parameters from photo url
        const image  = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
            if (user) {
                done(null, user);
            }
        });
    });

};

