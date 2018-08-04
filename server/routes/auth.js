const express = require('express');
const validator = require('validator');
const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer')
const User = require('mongoose').model('User');

const router = new express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'ubc.planner.app@gmail.com',
    pass: 'upa-admin-MEA3'
  }
});

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Please provide your email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/signup', (req, res, next) => {

  // const validationResult = validateSignupForm(req.body);

  // console.log('validation: ', validationResult.success);
  // if (!validationResult.success) {
  //
  //   return res.status(400).json({
  //     success: false,
  //     message: validationResult.message,
  //     errors: validationResult.errors
  //   });
  // }


  return passport.authenticate('local-signup', (err) => {
    if (err) {

      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'This email is already taken.'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    //TODO: email verification
    /*
    var token = new Token({ _userId: user.info._id, token: crypto.randomBytes(16).toString('hex') });

    token.save(function (err) {
           if (err) { return res.status(500).json({ success: false, message: err.message }); }

           var mailOptions = {
             to: user.info.email,
             from: 'ubc.planner.app@gmail.com',
             subject: 'Account Verification',
             text: 'Hello,\n\n' +
               'Please verify your account by clicking the link: ' + 'http://localhost:3000' + '/confirm?token=' + token.token + '.\n'
           };
           transporter.sendMail(mailOptions, function (err) {
               if (err) { return res.status(500).send({ success: false, message: err.message }); }
               return res.status(200).json({
                 success: true,
                 message: 'You have successfully signed up! Now you should be able to log in. A verification email has been sent to ' + user.info.email + '.'
               });
           });
       });
   });*/

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now you should be able to log in.'
    });
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req.body);

  if (!validationResult.success) {
    console.log("bad", validationResult.message)
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login', (err, token, userData) => {
      // console.log('auth result: ', token? 'success ' + token:'failed ' + err);
    if (err) {
        res.status(400);
      if (err.name === 'IncorrectCredentialsError') {
        return res.send({
          success: false,
          message: err.message
        });
      }

      return res.send({
        success: false,
        message: 'Could not process the form.',
        error: err
      });
    }

    // console.log(userData);
    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
});

router.post('/reset_password', (req, res) => {
  async.waterfall([
    function(done) {
      User.findOne({ "info.resetPasswordToken": req.body.token, "info.resetPasswordExpires": { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          return res.status(401).send({ error: 'Password reset token is invalid or has expired.' });
        }

        user.info.password = req.body.password;
        user.info.resetPasswordToken = undefined;
        user.info.resetPasswordExpires = undefined;

        user.save(function(err) {
            done(err, user);
        });
      });
    },
    function(user, done) {
      var mailOptions = {
        to: user.info.email,
        from: 'ubc.planner.app@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.info.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        return res.status(200).send({ message: 'Success! Redirecting you to the login page.' });
        done(err);
      });
    }
  ], function(err) {
    return res.status(500).send({ error: err });
  });
})

// TODO: email verification
/*
router.post('/confirmation', (req, res) => {
  Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', message: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ info._id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ message: 'We were unable to find a user for this token.' });
            if (user.info.isVerified) return res.status(400).send({ type: 'already-verified', message: 'This user has already been verified.' });

            // Verify and save the user
            user.info.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ message: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
}

router.post('/resend_confirmation', (req, res) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  // Check for validation errors
  var errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);

  User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ message: 'We were unable to find a user with that email.' });
        if (user.info.isVerified) return res.status(400).send({ message: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user.info._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ message: err.message }); }

            // Send the email
            var mailOptions = {
              to: user.info.email,
              from: 'ubc.planner.app@gmail.com',
              subject: 'Account Verification',
              text: 'Hello,\n\n' +
                'Please verify your account by clicking the link: ' + 'http://localhost:3000' + '/confirm?token=' + token.token + '.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ success: false, message: err.message }); }
                return res.status(200).send({ message: 'A verification email has been sent to ' + user.email + '.'});
            });
        });

    });
})*/




module.exports = router;
