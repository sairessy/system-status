var nodemailer = require('nodemailer')
var env = require('./env');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.nodemailer.email,
    pass: env.nodemailer.pass
  }
})

module.exports = transporter