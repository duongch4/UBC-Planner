const express = require('express');
const nodemailer = require('nodemailer')
const User = require('mongoose').model('User');
const async = require('async');
const crypto = require('crypto');

const router = new express.Router();
const emailAddress = "angeli_corpin@hotmail.com"; //get email of current user?

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'ubc.planner.app@gmail.com',
    pass: 'upa-admin-MEA3'
  }
});

router.post('/worksheet', (req, res) => {
  nodemailer.createTestAccount((err, account) => {
    const htmlEmail = "<p>${req}</p>"
    console.log(req.body.message)

    let mailOptions = {
      from: 'ubc.planner.app@gmail.com',
      to: emailAddress,
      subject: 'Worksheet for BCS Courses',
      text: req.body.message,
      html: htmlEmail
    }

    transporter.sendMail(mailOptions, (err, info) => {
      console.log("sendEmail")
      if (err) {
        return console.log(err)
      }
      console.log("Message sent")
    })

  })
})

router.post('/forgot_password', (req, res) => {
  console.log("forgot password: ", req.body.email)

  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({"info.email" : req.body.email}, function(err, user) {
        if (!user) {
          console.log('error', 'No account with that email address exists.');
          return res.redirect('/forgotpassword');
        }

        user.info.resetPasswordToken = token;
        user.info.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var mailOptions = {
        to: req.body.email,
        from: 'ubc.planner.app@gmail.com',
        subject: 'Password Reset Request',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your UBC-Planner account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
      //  return res.send(200, { message: 'Password reset email was sent.' });
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgotpassword');
  });
})

module.exports = router;
