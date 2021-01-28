/**
 * Mailgun model file
 *
 * @package   backend/src/models/mail
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var Mailgun = require('mailgun-js')
var mailConfig  = require('../../config/mail-config')

var mailgunModel = {
  send: send,
  sendWithOtherDomain: sendWithOtherDomain,
  checkEmailValidation: checkEmailValidation
}

/**
 * Function that send email templete. 
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string authData
 * @param   string authData
 * @param   string authData
 * @param   string authData
 * @param   string authData
 * @return  object if success returns object else returns message.
 */
function send(sender, receiver, subject, template, senderName) {
  if (sender === '') {
    sender = 'jobs@'+ mailConfig.MAILGUN.domain  
  } 
  var domain = mailConfig.MAILGUN.domain
  var mailgun = new Mailgun({apiKey: mailConfig.MAILGUN.privateApiKey, domain: domain})

  var data = {
    from: senderName + ' <' + sender + '>',
    to: receiver,
    subject: subject,
    html: template, 
    'o:tag': mailConfig.MAILGUN.developerTag
  }

  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, function (err, body) {
      //If there is an error, render the error page
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })    
}

/**
 * Function that send email templete with turing.com
 *
 * @author  YingTuring <ying@turing.com>
 * @param   string sender
 * @param   string receiver
 * @param   string subject
 * @param   string template
 * @param   string sendername
 * @return  object if success returns object else returns message.
 */
function sendWithOtherDomain(sender, receiver, subject, template, senderName) {
  if (sender === '') {
    sender = 'softwarejobs@' + mailConfig.MAILGUN.domain1  
  }
  var domain = mailConfig.MAILGUN.domain1
  var mailgun = new Mailgun({apiKey: mailConfig.MAILGUN.privateApiKey, domain: domain})

  var data = {
    from: senderName + ' <' + sender + '>',
    to: receiver,
    subject: subject,
    html: template, 
    'o:tag': mailConfig.MAILGUN.developerTag
  }

  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, function (err, body) {
      //If there is an error, render the error page
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })    
}

/**
 * Function that check email validation. 
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string email
 * @return  object if success returns object else returns message.
 */
function checkEmailValidation(email) {
  var domain = mailConfig.MAILGUN.domain
  var mailgun = new Mailgun({apiKey: mailConfig.MAILGUN.publicApiKey, domain: domain})

  return new Promise((resolve, reject) => {
    mailgun.validate(email, function (err, body) {
      if (err) {
        resolve(false)
      } else {
        resolve(body)
      } 
    })
  })    
}

module.exports = mailgunModel
