/**
 * Mail model file
 *
 * @package   backend/src/models/mail
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var table = require('../../constants/table')
var db = require('../../database/database')
var mailgunModel = require('./mailgun-model')
var mixmaxModel = require('./mixmax-model')
var sendGridModel = require('./sendgrid-model')
var emailSystemModel = require('./email-system-model')
var message  = require('../../constants/message')
const AutoHostBuildStatusConstants = require('../../constants/autohost_status')
const emailTemplates = require('../../constants/email_templates')
var pug = require('./pug-helper-model').compile
var dateFormat = require('dateformat')
var mailCategories = require('../../constants/mailCategory')
var fs = require('fs');

var mailModel = {
  saveInfo: saveInfo,
  mailValidation: mailValidation,
  getFakeEmailInfo: getFakeEmailInfo,
  getAllEmailInfo: getAllEmailInfo,
  sendTestEmail: sendTestEmail,
  sendEmail: sendEmail,
  sendEmailTemplate: sendEmailTemplate,
  sendEmailToManagerViaMixmax: sendEmailToManagerViaMixmax,
  sendChallengeEmailViaMixmax: sendChallengeEmailViaMixmax,
  sendInvitationMailViaSendGrid: sendInvitationMailViaSendGrid,
  sendInvitationEmail: sendInvitationEmail, 
  sendEmailViaSendGrid: sendEmailViaSendGrid,
  sendAutoHostDomainExhaustionWarning: sendAutoHostDomainExhaustionWarning,
  sendAutoHostDeployResponse: sendAutoHostDeployResponse,
}

/**
 * Function that send email templete. 
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string data
 * @return  object if success returns object else returns message.
 */
function saveInfo(data, uploadedDate) {
  return new Promise((resolve, reject) => {
    let query = 'INSERT INTO ' + table.MAIL_DASHBOARD + '(country, first_name, last_name, email, language, date, uploaded_date) VALUES (?, ?, ?, ?, ?, ?, ?)'

    db.query(query, [data.UserCountry, data.FirstName, data.LastName, data.Email, data.TestLanguage, data.CreatedDate, uploadedDate], (error, result, fields) => {
      if (error) {
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
 * @param   string data
 * @return  object if success returns object else returns message.
 */
function mailValidation() {
  return new Promise((resolve, reject) => {
    let query = "select * FROM " + table.MAIL_DASHBOARD + " WHERE uploaded_date = ( SELECT MAX( uploaded_date ) FROM " +
      table.MAIL_DASHBOARD + ") AND is_validated = 0 ORDER BY uploaded_date Desc, id"

      db.query(query, (error, result, fields) => {
        if (error) {
          resolve(false)
        } else {
          if (result.length > 0) {
            for (let i = 0 ; i < result.length; i ++) {
              mailgunModel.checkEmailValidation(result[i].email).then((body) => {
                if (body) {
                  let isValidated = 0
                  if (body.is_valid && (body.mailbox_verification === "true")) {
                    isValidated = 1
                  } else {
                    isValidated = 2
                  }
                    let query = 'UPDATE ' + table.MAIL_DASHBOARD + ' SET is_validated = ?, is_disposable_address = ?, is_role_address = ?, mailbox_verification = ?, is_valid = ? WHERE email = ?'

                    db.query(query, [isValidated, body.is_disposable_address, body.is_role_address, body.mailbox_verification, body.is_valid, result[i].email], (error, rows, fields) => {
                      if (error) {
                        i ++
                      } else {
                        if (i === (result.length - 1)) {
                          resolve(true)
                        }
                      }
                    })
                } else {
                  i ++ 
                }
              })
            }
          } else {
            resolve(true)
          }
        }
      })
  })
}

/**
 * Function that get fake email info. 
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object data
 * @return  object if success returns object else returns message.
 */
function getFakeEmailInfo(data) {
  return new Promise((resolve, reject) => {
    let query = "SELECT COUNT(*) AS count FROM " + table.MAIL_DASHBOARD + " WHERE uploaded_date = ( SELECT MAX( uploaded_date ) FROM " +
      table.MAIL_DASHBOARD + ") AND is_validated = 2 ORDER BY uploaded_date DESC, id "

    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let count = 0
        if (rows.length > 0) {
          count = rows[0].count
        }

        let query = "select * FROM " + table.MAIL_DASHBOARD + " WHERE uploaded_date = ( SELECT MAX( uploaded_date ) FROM " +
          table.MAIL_DASHBOARD + ") AND is_validated = 2 ORDER BY uploaded_date Desc, id "

        if (Number(data.page) != -1 && Number(data.rowsPerPage) != -1) {
          query += " LIMIT ?, ?"
        }  

        db.query(query, [Number(data.page) * Number(data.rowsPerPage), Number(data.rowsPerPage)], (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
            resolve({ count: count, rows: rows })
          }
        })
      }
    })  
  })    
}

/**
 * Function that get all imported email info. 
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object data
 * @return  object if success returns object else returns message.
 */
function getAllEmailInfo(data) {
  return new Promise((resolve, reject) => {
    let query = "SELECT COUNT(*) AS count FROM " + table.MAIL_DASHBOARD + " WHERE uploaded_date = ( SELECT MAX( uploaded_date ) FROM " +
      table.MAIL_DASHBOARD + ") ORDER BY uploaded_date DESC, id "

    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let count = 0
        if (rows.length > 0) {
          count = rows[0].count
        }

        let query = "select * FROM " + table.MAIL_DASHBOARD + " WHERE uploaded_date = ( SELECT MAX( uploaded_date ) FROM " +
          table.MAIL_DASHBOARD + ") ORDER BY uploaded_date Desc, id "

        if (Number(data.page) != -1 && Number(data.rowsPerPage) != -1) {
          query += " LIMIT ?, ?"
        }  

        db.query(query, [Number(data.page) * Number(data.rowsPerPage), Number(data.rowsPerPage)], (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
            resolve({ count: count, rows: rows })
          }
        })
      }
    })  
  })    
}

/**
 * Function that send the emails to test users
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string data
 * @return  object if success returns object else returns message.
 */
function sendTestEmail(data) {
  return new Promise((resolve, reject) => {
    let query = "select * FROM " + table.MAIL_DASHBOARD + " WHERE uploaded_date = ( SELECT MAX( uploaded_date ) FROM " +
    table.MAIL_DASHBOARD + ") AND is_tester = 1 AND sent_status = 0 AND sent_once = 0 AND email <> '' ORDER BY uploaded_date Desc, id LIMIT 0, 40"

    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let sentDate = new Date()
        if (rows.length > 0) {
          for (let i = 0 ; i < rows.length; i ++) {
            mailModel.sendEmailTemplate(rows[i].first_name, rows[i].last_name, rows[i].email, '', '').then((status) => {
              if (status) {
                  console.log('Sent-Status---Email--' + rows[i].email + '--id--' + rows[i].id + '--i--' + i)
                  let query = 'UPDATE ' + table.MAIL_DASHBOARD + ' SET sent_date = ?, sent_status = 1, sent_once = 1 WHERE id = ?'

                  db.query(query, [sentDate, rows[i].id], (error, result, fields) => {
                    if (error) {
                      i ++
                    } else {
                      if (i === (rows.length - 1)) {
                        resolve(true)
                      }
                    }
                  })
              } else {
                  let query = 'UPDATE ' + table.MAIL_DASHBOARD + ' SET sent_date = ?, sent_status = 0, sent_once = 1 WHERE id = ?'

                  db.query(query, [sentDate, rows[i].id], (error, result, fields) => {
                    if (error) {
                      i ++
                    } else {
                      if (i === (rows.length - 1)) {
                        resolve(true)
                      }
                    }
                  })
              }
            })
          }
        } else {
          resolve(true)
        }
      }
    })
  })    
}

/**
 * Function that send the emails to test users
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string data
 * @return  object if success returns object else returns message.
 */
function sendEmail(data) {
  return new Promise((resolve, reject) => {
    let query = "select * FROM " + table.MAIL_DASHBOARD + " WHERE uploaded_date = ( SELECT MAX( uploaded_date ) FROM " +
      table.MAIL_DASHBOARD + ") AND is_tester = 0 AND sent_status = 0 AND sent_once = 0 AND email <> '' ORDER BY uploaded_date Desc, id LIMIT 0, 40"

    db.query(query, (error, rows, fields) => {
      if (error) {
        resolve(true)
      } else {
        let sentDate = new Date()
        if (rows.length > 0) {
          for (let i = 0 ; i < rows.length; i ++) {
            if (rows[i].email.length > 0) {
              mailModel.sendEmailTemplate(rows[i].first_name, rows[i].last_name, rows[i].email, '', '').then((status) => {
                if (status) {
                    console.log('Sent-Status---Email--' + rows[i].email + '--id--' + rows[i].id + '--i--' + i)
                    let query = 'UPDATE ' + table.MAIL_DASHBOARD + ' SET sent_date = ?, sent_status = 1, sent_once = 1 WHERE id = ?'

                    db.query(query, [sentDate, rows[i].id], (error, result, fields) => {
                      if (error) {
                        i ++
                      } else {
                        if (i === (rows.length - 1)) {
                          resolve(true)
                        }
                      }
                    })
                } else {
                    let query = 'UPDATE ' + table.MAIL_DASHBOARD + ' SET sent_date = ?, sent_status = 0, sent_once = 1 WHERE id = ?'

                    db.query(query, [sentDate, rows[i].id], (error, result, fields) => {
                      if (error) {
                        i ++
                      } else {
                        if (i === (rows.length - 1)) {
                          resolve(true)
                        }
                      }
                    })
                }
              })
            }
          }
        } else {
          resolve(true)
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
function sendEmailTemplate(firstName, lastName, email, subject, senderName) {
  return new Promise((resolve, reject) => {
    let link = 'https://docs.google.com/forms/d/e/1FAIpQLSetNwAwlUpcaZTm3ihlAU73lUi4tpw87D7pw9nsR4A5foYm1A/viewform?usp=pp_url&entry.1173774429=' + firstName + '&entry.1232633084=' + lastName + '&entry.1594215283=' + email + ''

    senderName = 'Turing Software Jobs'
    sender = 'softwarejobs@turing.com'
    if (firstName.length !==0) {
      subject = firstName + ', are you an expert in data engineering?'
    } else {
      subject = 'Are you an expert in data engineering?'
    }
    pug("mail/fullstack_survey_template1", { firstName: firstName, link: link }, function (content) {
      mailgunModel.sendWithOtherDomain(sender, email, subject, content, senderName).then((sentStatus) => {
        if (sentStatus)
          resolve(true)
        else
          resolve(false)
      })
    })
  })
}

/**
 * Function that send frontend challenge email
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string firstName
 * @param   string lastName
 * @param   string email
 * @return  string 
 */
function sendFrontendChallengeEmailViaMixmax(firstName, lastName, email) {
  const link1 = 'https://docs.google.com/document/d/1MA8ZejXpTAfzzWZ76PD4RyLb_7I2OjQbkKQA9ps3C-M/edit'
  const subject = 'Turing - Front End Engineer Challenge ' + firstName + ' ' + lastName
  const sender = 'softwarejobs@turing.com'
  const senderName = 'Turing Software Jobs'
  return new Promise((resolve, reject) => {
    pug("mail/frontend_challenge_template", { firstName: firstName, lastName: lastName, link1: link1 }, function (content) {
      mixmaxModel.send(sender, email, subject, content, senderName).then((sentStatus) => {
        if (sentStatus)
          resolve(true)
        else
          resolve(false)
      })
    })
  })
}

/**
 * Function that send fullstack challenge email
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string firstName
 * @param   string lastName
 * @param   string email
 * @param   string language
 * @param   date   datePalindrome
 * @param   int    challengeOption
 * @return  string 
 */
function sendChallengeEmailViaMixmax(firstName, lastName, email, language, datePalindrome, challengeOption) {
  let link = ''
  let challengeName = ''
  let linkName = ''
  let challengeDay = 7
  challengeOption = parseInt(challengeOption)
  if (challengeOption === 1) {
    link = 'https://docs.google.com/document/d/1MA8ZejXpTAfzzWZ76PD4RyLb_7I2OjQbkKQA9ps3C-M/edit'
    linkName = 'Front End Challenge'
    challengeName = 'front-end'
  } else if (challengeOption === 2) {
    link = 'https://docs.google.com/document/d/11QzT_CGleoj9-6liVgqctN90WRnkYtjL3BgM1wbx-_E/edit'
    linkName = 'Full Stack Challenge'
    challengeName = 'full stack'
    challengeDay = 14
  } else if (challengeOption === 3) {
    link = 'https://docs.google.com/document/d/1MjPI6FqV6TL0rZ24ZYRAMp5kD8UO1doBtBiJvtgiWkY/edit?usp=sharing'
    linkName = 'Back End Challenge'
    challengeName = 'back-end'
  } else if (challengeOption === 4) {
    link = 'https://docs.google.com/document/d/1jLzMbdLltCDBMw30y1tu2U4PQ_jLtljzahJ2cMStTKw/edit?usp=sharing'
    linkName = 'DevOps Challenge'
    challengeName = 'devops'
  } else if (challengeOption === 5) {
    link = 'https://docs.google.com/document/d/1JqaxpNDF2t9UumYXqc0mpOmDTaqUYePmpcfwukTr7Mg/edit?usp=sharing'
    linkName = 'Mobile Challenge'
    challengeName = 'mobile'
  } else if (challengeOption === 6) {
    link = 'https://docs.google.com/document/d/1Wc0G298fGndHcgDshyU2BvgsPcflAPhH5AWEcUF5xkU/edit'
    linkName = 'UI/UX Challenge'
    challengeName = 'UI/UX'
  } else if (challengeOption === 7) {
    link = 'https://docs.google.com/document/d/1h-EUJyx0NBuM0S8hiL0pGpGqnLLbNQoh0op2bV-dVuU/edit'
    linkName = 'Machine Learning Challenge'
    challengeName = 'machine learning'
  } else if (challengeOption === 8) {
    link = 'https://docs.google.com/document/u/4/d/1qXQkp37_3QgpqdqKgy8F_Bje_EIhUY-4cSFgY9NFn34/edit'
    linkName = 'Data Engineering Challenge'
    challengeName = 'data engineering'
  }
  
  let strDatePalindrome = ''
  if (datePalindrome === null) {
    strDatePalindrome = ''
  } else {
    datePalindrome = new Date(datePalindrome)
    strDatePalindrome = dateFormat(datePalindrome, "mmmm d, yyyy")
  }
  let subject = ''
  if ((firstName === '') && (lastName === '')) {
    subject = `Congrats on passing Turing's `  + language + ' test on ' + strDatePalindrome + '!'
  } else {
    subject = firstName + ' ' + lastName + `, Congrats on passing Turing's `  + language + ' test on ' + strDatePalindrome + '!'
  }
  const sender = 'softwarejobs@turing.com'
  const senderName = 'Turing Software Jobs'
  return new Promise((resolve, reject) => {
    let receivers = [
      {email: email, name: firstName + ' ' + lastName}
    ]; 
    const templateId = emailTemplates.PROGRAMMING_CHALLENGE_EMAIL;
    let replacements = [
      { firstName: firstName, lastName: lastName, testLanguage: language, link: link, linkName: linkName, datePalindrome: strDatePalindrome, challengeName: challengeName, challengeDay: challengeDay }
    ]
    emailSystemModel.send(receivers, templateId, replacements).then(res => {
      if(res.data[0] === true) {
        resolve(true)
      } else {
        resolve(false)
      }
    }).catch(err => {
      resolve(false)
    })
  })
}

/**
 * Function that send notify email to manager after the user submitted challenge source
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   string userId
 * @param   string firstName
 * @param   string lastName
 * @param   string email
 * @return  string 
 */
function sendEmailToManagerViaMixmax(userId, firstName, lastName, email, sourceCodeName, country, challengeName, createdDate, githubLink, estimatedTime, hostLink) {
  const subject = 'Uploaded challenge test from ' + email + '!'
  const sender = 'turingdev42018@gmail.com'
  const senderName = 'Turing Dev'
  var sourceCodeLink = 'https://turing.engineering:9001/public/sourcecode/' + sourceCodeName

  return new Promise((resolve, reject) => {
    pug("mail/send_challenge_notify_template", { userId: userId, firstName: firstName, lastName: lastName, email: email , sourceCodeLink: sourceCodeLink, country: country, challengeName: challengeName, created_date: createdDate, githubLink: githubLink, estimated_time: estimatedTime, hostLink: hostLink }, function (content) {
      mixmaxModel.send(sender, 'softwarejobs@turing.com', subject, content, senderName).then((sentStatus) => {
        if (sentStatus)
          resolve(true)
        else
          resolve(false)
      })
    })
  })
}

function sendAutoHostDeployResponse(receiver, hostUrl, status){
  const sender = 'no-reply@turing.com'
  const senderName = 'Turing.com'
  const subject = 'Turing Autohost Notification'
  receiver = {
    email: receiver.email,
    name: receiver.first_name,
    link: hostUrl
  };


  let template = '';
  switch (parseInt(status)) {
    case AutoHostBuildStatusConstants.SUCCESS:
      template = fs.readFileSync('./src/views/mail/autohost.html', 'utf8');
      break;
    case AutoHostBuildStatusConstants.FAILED:
      template = fs.readFileSync('./src/views/mail/autohost_failed.html', 'utf8');
      break;
  }
  return new Promise((resolve, reject) => {
    sendGridModel.sendGeneric(sender, receiver, subject, template, senderName, "", ["AutoHost"]).then((sentStatus) => {
      if(sentStatus){
        return resolve(true);
      }
      reject(false);
    }).catch(err => console.log(err))
  })
}

function sendAutoHostDomainExhaustionWarning(receivers, remainder){
  const sender = 'autohost@turing.website'
  const senderName = 'Turing Autohost'
  const subject = 'Turing Autohost Domain Exhaustion Warning'
  receivers = receivers.map(receiver => ({email: receiver, first_name: "Administrator"}));
  const template = `<p>The domains are getting to exhaustion. The remaining amount of domains that can be generated is ${remainder}</p>`;
  return new Promise((resolve, reject) => {
    sendGridModel.send(sender, receivers, subject, template, senderName).then((sentStatus) => {
      if(sentStatus){
        return resolve(true);
      }
      reject(false);
    }).catch(err => console.log(err))
  })
}

function sendInvitationMailViaSendGrid(receivers, template){
  const sender = 'jobs@turing.website'
  const senderName = 'Turing'
  const subject = 'Interested in American software jobs? Please complete Turing programming test.'
  const categories = [mailCategories.TEST_DETAILS_REQUEST]

  // send(sender, receivers, subject, template, senderName, unsubscribeHeader = "") 
  return new Promise((resolve, reject) => {
    sendGridModel.send (sender, receivers, subject, template, senderName, '', categories).then((sentStatus) => {
      if(sentStatus)
        resolve(true)
      else
        resolve(false)
    })
  })
}

function sendInvitationEmail(receivers) {
  const templateId = emailTemplates.DEVELOPER_YES_OR_NO_TEMPLATE;
  let replacements = []
  receivers = [{email: receivers.email}]
  return new Promise((resolve, reject) => {
    emailSystemModel.send(receivers, templateId, replacements).then(res => {
      if(res[0] === true) {
        resolve(true)
      } else {
        resolve(false)
      }
    }).catch(err => {
      resolve(false)
    })
  })
}

function sendEmailViaSendGrid(sender, receivers, subject, template, senderName, unsubscribeHeader = "", categories=[]){
  return new Promise((resolve, reject) => {
    sendGridModel.sendGeneric (sender, receivers, subject, template, senderName, unsubscribeHeader, categories).then((response) => {
      if(response)
        resolve(response.statusCode)
      else
        resolve(false)
    })
  })
}


module.exports = mailModel
