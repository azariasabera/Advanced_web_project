const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const Users = require('../models/Users');
passport.use(new GoogleStrategy({
    clientID: "145191071256-jo95v217cku0tnfas2ndgcek8iukj4tu.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:1234/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await Users.findOne({ googleId: profile.id });

      if (!user) {
        user = new Users({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          date: new Date()
        });
        await user.save();
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});