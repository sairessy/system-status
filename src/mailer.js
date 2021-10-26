var nodemailer = require('nodemailer')
require('dotenv').config()

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS
  }
})

module.exports = transporter