const express = require('express');
const nodemailer = require('nodemailer')
const User = require('mongoose').model('User');
const async = require('async');
const crypto = require('crypto');

const router = new express.Router();

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
    const style = '<style>table, td, th { border: 1px solid #ddd; text-align: left; } table { border-collapse: collapse; width: 100%; } th, td { padding: 15px; }</style>';
    const htmlEmail = style + req.body.data;

    let mailOptions = {
      from: 'ubc.planner.app@gmail.com',
      to: req.body.email,
      subject: 'Worksheet for BCS Courses',
      html: htmlEmail

    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err)
      }
      console.log("Message sent")
    })

  })
})

router.post('/forgot_password', (req, res, next) => {

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
          return res.status(200).send({ message: 'No account with that email address exists.' });
        }

        user.info.resetPasswordToken = token;
        user.info.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    // TODO CHANGE http://localhost:3000 to heroku later!!!!
    function(token, user, done) {
      var mailOptions = {
        to: req.body.email,
        from: 'ubc.planner.app@gmail.com',
        subject: 'Password Reset Request',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your UBC-Planner account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:3000' + '/reset?token=' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        return res.status(200).send({ message: 'Password reset email was sent.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    return res.status(500).send({ message: err });
  });
})

module.exports = router;
