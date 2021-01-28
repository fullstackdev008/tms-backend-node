/**
 * Mixmax model file
 *
 * @package   backend/src/models/mail
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

const request = require('superagent')
var mailConfig  = require('../../config/mail-config')
var mixmaxModel = {
  send: send
}

/**
 * Function that send email templete. 
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string sender
 * @param   string receiver
 * @param   string subject
 * @param   string template
 * @return  object if success returns object else returns message.
 */
function send(sender, receiver, subject, template, senderName) {
  if (sender === '') {
    sender = 'softwarejobs@'+ mailConfig.MIXMAX.domain  
  } 
  var to = {
    'email': receiver,
    'name': ''
  }

  return new Promise((resolve, reject) => {
    request
      .post(mailConfig.MIXMAX.baseUrl + 'messages')
      .send({
        to: [to],
        subject: subject,
        body: template
      })
      .set('Accept', '*/*')
      .set('accept-encoding', 'gzip, deflate')
      .set('content-type', 'application/json')
      .set('X-API-Token', mailConfig.MIXMAX.apiToken)
      .then((res) => {
        if((res.status === 200) && (res.body.hasOwnProperty('_id')) && (res.body._id.length > 0)) {
          let emailId = res.body._id
          let sendingOption = {
            'trackingEnabled': true,
            'linkTrackingEnabled': true,
            'fileTrackingEnabled': true,
            'notificationsEnabled': true,
            'userHasModified': true
          }
          request
            .post(mailConfig.MIXMAX.baseUrl + 'messages/' + emailId + '/send')
            .set('Accept', '*/*')
            .send({
              data: sendingOption
            })
            .set('accept-encoding', 'gzip, deflate')
            .set('content-type', 'application/json')
            .set('X-API-Token', mailConfig.MIXMAX.apiToken)
            .then((result) => {
                resolve(true)
            })
            .catch((err) => {
              resolve(false)
            })
        } else {
          resolve(false)
        }
      })
      .catch((err) => {
        resolve(false)
      })
  })    
}

module.exports = mixmaxModel
