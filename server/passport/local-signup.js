const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  console.log('sign up', email, password);
  const userData = {
    info: {
      email: email.trim(),
        password: password.trim(),
        name: req.body.name.trim(),
        sid: req.body.sid,
        bm: req.body.bm.trim(),
        cohort: req.body.cohort
    },
    courses: {},
    remarks: {
       "PADE": "",
       "ENGL 1XX": "",
       "CPSC 110": "",
       "CPSC 121": "",
       "MATH 180": "",
       "STAT 203": "",
       "Communication": "",
       "CPSC 210": "",
       "CPSC 221": "",
       "CPSC 213": "",
       "CPSC 310": "",
       "CPSC 320": "",
       "CPSC 313": "",
       "CPSC 3X1": "",
       "CPSC 3X2": "",
       "CPSC 4X1": "",
       "CPSC 4X2": "",
       "BM1": "",
       "BM2": "",
       "BM3": "",
       "BM4": ""
    }
  };

  const newUser = new User(userData);
  newUser.save((err) => {
    if (err) { return done(err); }

      console.log('user saved');

    return done(null);
  });
});
