const express = require('express');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const User = require('mongoose').model('User');

const router = new express.Router();

router.post('/worksheet', (req, res) => {
  console.log(req.body)
})

module.exports = router;
