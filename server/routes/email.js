const express = require('express');
const nodemailer = require('nodemailer')
const User = require('mongoose').model('User');

const router = new express.Router();

router.post('/worksheet', (req, res) => {
  nodemailer.createTestAccount((err, account) => {
    const htmlEmail = "<p>${req.body.message}</p>"

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'ubc.planner.app@gmail.com',
        pass: 'upa-admin-MEA3'
      }
    });

    let mailOptions = {
      from: 'ubc.planner.app@gmail.com',
      to: 'angeli_corpin@hotmail.com',
      subject: 'Worksheet for BCS Courses',
      text: req.body.message,
      html: htmlEmail
    }

    transporter.sendMail(mailOptions, (err, info) => {
      console.log(sendEmail)
      if (err) {
        return console.log(err)
      }
      console.log("Message sent")
    })

  })
})

module.exports = router;
