require('dotenv').config()
const nodemailer = require('nodemailer')
const Logger = require('centinela-logger')
var logger = new Logger(__filename)
  //https://nodemailer.com/about/
module.exports = class EmailService {
  constructor() {
    const emailPassword = process.env.EMAIL_PASSWORD
    const emailAddress = process.env.EMAIL_ADDRESS
    this.fromEmail = emailAddress
    this.mail = nodemailer.createTransport({
      service: 'gmail'
      , auth: {
        user: emailAddress
        , pass: emailPassword
      }
      , pool: true //https://nodemailer.com/smtp/pooled/
    })
  }

  async sendEmail(to, subject, body, html) {
    var mailOptions = {
      from: `"Centinela App" <${this.fromEmail}>`
      , to: to
      , subject: subject
      , text: body
      , html: html
    }
    try {
      var info = await this.mail.sendMail(mailOptions)
      logger.debug(
        `Email to ${to} sent. Info: ${JSON.stringify(info)}`)
      return info
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
