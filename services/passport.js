const keys = require("../config/keys");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id).then(user => {
        cb(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleSecret,
            callbackURL: "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            User.findOne({ googleID: profile.id }).then(user => {
                if (user) {
                    return cb(null, user);
                }
                new User({ googleID: profile.id }).save().then(user => {
                    cb(null, user);
                });
            });
        }
    )
);
