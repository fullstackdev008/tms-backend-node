/**
 * Cli model file
 *
 * @package   backend/src/models
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var db = require('../database/database')
var table  = require('../constants/table')
var bcrypt = require('bcrypt-nodejs')
var mailgunModel = require('../models/mail/mailgun-model')
var mixmaxModel = require('../models/mail/mixmax-model')
var pug = require('./mail/pug-helper-model').compile
var message = require('../constants/message')
var code = require('../constants/code')
var path = require('../constants/path')

var cliModel = {
  check15Mins: check15Mins,
  check3Days: check3Days,
  check6Days: check6Days,
  check9Days: check9Days,
  sendEmailNeedComplete: sendEmailNeedComplete,
  checkSupressions: checkSupressions,
  sendEmail: sendEmail,
  createToken: createToken,
  getUsers: getUsers,
  updateSentStatus: updateSentStatus,
  sendForgotPassEmail: sendForgotPassEmail,
  sendForgotPass: sendForgotPass,
  getUid: getUid
}

/**
 * function that checks users by 15 mins and sends the email to user.
 *
 * @author  DongTuring <dong@turing.com>
 * @return  void
 */
function check15Mins()
{
  return new Promise((resolve, reject) => {
    cliModel.getUsers(0).then((users) => {
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          cliModel.sendEmailNeedComplete(users[i], 1).then((result) => {
            if (i === (users.length - 1)) {
              console.log(i)
              resolve(true)
            } 
          })
        }
      } else {
        resolve(true)
      }
    })
  })
}
  
/**
 * function that checks users by 3 days and sends the email to user.
 *
 * @author  DongTuring <dong@turing.com>
 * @return  void
 */
function check3Days()
{
  return new Promise((resolve, reject) => {
    cliModel.getUsers(1).then((users) => {
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          cliModel.sendEmailNeedComplete(users[i], 2).then((result) => {
            if (i === (users.length - 1)) {
              console.log(i)
              resolve(true)
            } 
          })
        }
      } else {
        resolve(true)
      }
    })
  })
}
  
/**
 * function that checks users by 6 days and sends the email to user.
 *
 * @author  DongTuring <dong@turing.com>
 * @return  void
 */
function check6Days()
{
  return new Promise((resolve, reject) => {
    cliModel.getUsers(2).then((users) => {
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          cliModel.sendEmailNeedComplete(users[i], 3).then((result) => {
            if (i === (users.length - 1)) {
              console.log(i)
              resolve(true)
            } 
          })
        }
      } else {
        resolve(true)
      }
    })
  })
}
  
/**
 * function that checks users by 9 days and sends the email to user.
 *
 * @author  DongTuring <dong@turing.com>
 * @return  void
 */
function check9Days()
{
  return new Promise((resolve, reject) => {
    cliModel.getUsers(3).then((users) => {
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          cliModel.sendEmailNeedComplete(users[i], 4).then((result) => {
            if (i === (users.length - 1)) {
              console.log(i)
              resolve(true)
            } 
          })
        }
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * function that send forgot pass email 
 *
 * @author  DongTuring <dong@turing.com>
 * @return  void
 */
function sendForgotPass(email)
{
  return new Promise((resolve, reject) => {
    cliModel.sendForgotPassEmail(email).then((sentResult) => {
      if (sentResult){
        resolve({ code: code.OK, message: '', data: {} })
      } else {
        reject({ code: code.INTERNAL_SERVER_ERROR, message: message.INTERNAL_SERVER_ERROR, data: {} })
      }
    })
  })
}

/**
 * Get users
 *
 * @author  DongTuring <dong@turing.com>
 * @param   int sentStatus sentStatus of user
 * @return  array | boolean
 */
function getUsers(sentStatus)
{
  return new Promise((resolve, reject) => {
    let currentTime = new Date()
    let query = 'SELECT ' + table.SUBMIT_LIST + '.uid, ' +  table.SUBMIT_LIST + '.email ' +
      'FROM ' + table.SUBMIT_LIST + ' JOIN ' + table.SUBMIT_NOTIFICATION + ' ON ' + table.SUBMIT_LIST + '.uid = ' + table.SUBMIT_NOTIFICATION + '.uid ' +
      'WHERE '+ table.SUBMIT_NOTIFICATION + '.sent_status = ? ' +
      'AND '+ table.SUBMIT_NOTIFICATION + '.unsubscribed = 0 '

      if (sentStatus === 0) {
        query += 'AND '+ table.SUBMIT_NOTIFICATION + '.after_15mins < ? ' 
      }
      else if ($sentStatus === 1) {
        query += 'AND '+ table.SUBMIT_NOTIFICATION + '.after_3days < ? ' 
      }
      else if ($sentStatus === 2) {
        query += 'AND '+ table.SUBMIT_NOTIFICATION + '.after_6days < ? ' 
      } else {
        query += 'AND '+ table.SUBMIT_NOTIFICATION + '.after_9days < ? ' 
      }

    db.query(query, [sentStatus, currentTime], (error, result, fields) => {
      if (error) {
        resolve(false)
      } else {
        resolve(result)
      }
    })  
  })
}

/**
 * function that sends the email to require completing profile.
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object receiver
 * @param   int pageNum
 * @return  void
 */
function sendEmailNeedComplete(receiver, sentStatus)
{
  return new Promise((resolve, reject) => {
    let subject = 'Welcome To our site!'
    // create token
    cliModel.createToken(receiver.uid).then((token) => {
      if (token) {
        // check email suppression
        cliModel.checkSupressions(receiver.email, receiver.uid).then((result) => {
          if (!result) {
            // send email
            let yesLink = path.BASE_URL + '?token=' + token + '&type=0' + '&template=complete1'
            let unsubscribeLink = path.BASE_URL + 'login/unsubscribe?token='+ token + '&type=2' + '&template=complete1'
            let noLink = path.BASE_URL + 'login/unsubscribe?token=' + token + '&type=1' + '&template=complete1'

            cliModel.sendEmail(yesLink, unsubscribeLink, noLink, receiver.email, subject).then((result) => {
              if (result) {
                cliModel.updateSentStatus(receiver.uid, sentStatus).then((result) => {
                  resolve(result)
                }) 
              } else {
                resolve(false)        
              }
            })
          } else {
            resolve(false)
          }
        })
      } else {
        resolve(false)
      }
    })
  })
}
  
/**
 * function that create the token.
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object receiver
 * @param   int sid
 * @return  void
 */
function createToken(uid)
{
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.MAIL_TOKEN + ' WHERE uid = ?'

    db.query(query, [uid], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (rows.length >0) {
          resolve(rows[0].token)
        } else {
          let token = bcrypt.hashSync(uid)
          let query = 'INSERT INTO ' + table.MAIL_TOKEN + '(uid, token) VALUES (?, ?)'
        
          db.query(query, [uid, token], (error, result, fields) => {
            if (error) {
              resolve(false)
            } else {
              resolve(token)
            }
          })
        }
      }
    })
  })
}

/**
 * Function that test sending email
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function sendEmail(yesLink, unsubscribeLink, noLink, email, subject) {
  return new Promise((resolve, reject) => {
    pug("mail/complete_page", { yesLink: yesLink, unsubscribeLink: unsubscribeLink, noLink: noLink }, function (content) {
      mailgunModel.send('', email, subject, content, '').then((sentStatus) => {
        if (sentStatus)
          resolve(true)
        else
          resolve(false)
      })
    })
  })
}

/**
 * Function that test sending email
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function sendForgotPassEmail(email) {
  return new Promise((resolve, reject) => {
    // Get user id
    cliModel.getUid(email).then((uid) => {
      if (uid) {
        // Create token
        cliModel.createToken(uid).then((token) => {
          if (token) {
            // send email
            let resetPassLink = path.BASE_URL + 'login/reset_pass?token=' + token + '&template=complete1'
            let unsubscribeLink = path.BASE_URL + 'login/unsubscribe?token='+ token + '&type=2' + '&template=complete1'
            let subject = 'Forgotten password request'

            pug("mail/forgot_pass", { resetPassLink: resetPassLink, unsubscribeLink: unsubscribeLink }, function (content) {
              mixmaxModel.send('', email, subject, content, '').then((sentStatus) => {
                if (sentStatus)
                  resolve(true)
                else
                  resolve(false)
              })
            })
          } else {
            resolve(false)
          }
        })
      } else {
        resolve(false)
      }
    })  
  })
}

/**
 * Function that check email supressions
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function checkSupressions(email, uid) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT event_id, recipient, event_type, serverity_type, reason FROM ' + table.MAILGUN_EVENT_LOGS + 
      ' WHERE (event_type = "failed" and recipient = ?) ' +
      ' OR (event_type = "complained" and recipient = ?) ' +
      ' OR (event_type = "unsubscribed" and recipient = ?) '

    db.query(query, [ email, email, email ], (error, rows, fields) => {
      if (error) {
        resolve(true)
      } else {
        if (rows.length > 0) {
          let query = 'UPDATE ' + table.SUBMIT_NOTIFICATION + ' SET sent_status = ?, supressions = ? WHERE uid = ? '

          db.query(query, [ 5, 1, uid ], (error, result, fields) => {
            if (error) {
              resolve(true)
            } else {
              resolve(true)
            }
          })
        } else {
          resolve(false)
        }
      }
    })
  })
}

/**
 * Function that check updateSentStatus
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function updateSentStatus(uid, sentStatus) {
  return new Promise((resolve, reject) => {
    let query = 'UPDATE ' + table.SUBMIT_NOTIFICATION + ' SET sent_status = ? WHERE uid = ? '

    db.query(query, [ sentStatus, uid ], (error, result, fields) => {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that get user id by email
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function getUid(email) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT id FROM ' + table.USER_LIST + ' WHERE email = ? '

    db.query(query, [ email ], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (rows.length > 0){
          resolve(rows[0].id)
        } else {
          resolve(false)
        }
      }
    })
  })
}

module.exports = cliModel
