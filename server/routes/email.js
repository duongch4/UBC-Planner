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


router.post('/user_worksheet', (req, res) => {
    const style = '<style>table, td, th { border: 1px solid #ddd; text-align: left; } table { border-collapse: collapse; width: 100%; } th, td { padding: 15px; }</style>';
    const htmlEmail = style + req.body.divToPrint;

    let mailOptions = {
      from: 'ubc.planner.app@gmail.com',
      to: req.body.email,
      subject: 'Worksheet for BCS Courses',
      html: htmlEmail

    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(400).send({ error: "Email not sent." });
      }
      return res.status(200).send({ message: 'No account with that email address exists.' });
    })
})

router.post('/director_worksheet', (req, res) => {
    const style = '<style>table, td, th { border: 1px solid #ddd; text-align: left; } table { border-collapse: collapse; width: 100%; } th, td { padding: 15px; }</style>';
    const htmlChecklist = style + req.body.divToPrint;
    const message = req.body.data.text + "\n\n" + "NOTE: Please reply to the email address in the “to” address bar and not to the ubc.planner.app@gmail.com account." + "\n";
    const htmlMessage = '<p>' + message.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>") + '</p>';

    let mailOptions = {
      from: 'ubc.planner.app@gmail.com',
      to: req.body.data.to,
      subject: req.body.data.subject,
      html: htmlMessage + htmlChecklist
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        // TODO not sure if right status code
        return res.status(400).send({ error: "Email not sent."  });
      }
      return res.status(200).send({ message: 'Email successfully sent.' });
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
          return res.status(400).send({ error: 'No account with that email address exists.' });
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
    return res.status(500).send({ error: err });
  });
})

module.exports = router;
