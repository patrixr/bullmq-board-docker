const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const {
  LOGIN_USER = 'bull',
  LOGIN_PASSWORD = 'board',
  LOGIN_USERNAME = 'bull-board'
} = process.env;

// Configure the local strategy for use by Passport.
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(
  new LocalStrategy((username, password, cb) => {
    if (username === LOGIN_USER && password === LOGIN_PASSWORD) {
      return cb(null, { user: LOGIN_USERNAME });
    }
    return cb(null, false);
  }),
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports = passport;
