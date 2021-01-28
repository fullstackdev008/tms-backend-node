/**
 * Auth model file
 *
 * @package   backend/src/models
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var db = require('../database/database')
var message  = require('../constants/message')
var bcrypt = require('bcrypt-nodejs')
var table  = require('../constants/table')
var redirectModel = require('./redirect-model')
var visitModel = require('./visit-model')
var client = require("@sendgrid/client")
var mailConfig = require("../config/mail-config");
var crypto = require('crypto')

client.setApiKey(mailConfig.SENDGRID.apiKey);
const request = {
  method: "GET",
  url: "/v3/api_keys"
};

client.setDefaultRequest("baseUrl", mailConfig.SENDGRID.baseUrl);

var authModel = {
  login: login,
  loginForAdmin: loginForAdmin,
  signup: signup, 
  checkUncompletedPage: checkUncompletedPage, 
  saveSubmitNotification: saveSubmitNotification,
  getUidByToken: getUidByToken,
  resetPass: resetPass,
  getRedirectUrlFromMailToken: getRedirectUrlFromMailToken,
  unsubscribe: unsubscribe,
  setUnsubscribed: setUnsubscribed,
  logout: logout,
  getPassword: getPassword,
  unsubscribeTuringEmail: unsubscribeTuringEmail,
  createApiKey: createApiKey,
  apiKeyExists: apiKeyExists,
  accessTokenExists: accessTokenExists,
  log4Social: log4Social
}

/**
 * Function that check uncompleted page 
 *
 * @author  DongTuring <dong@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function checkUncompletedPage(userId) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT ' + table.SUBMIT_LIST + '.* ' +
      'FROM ' + table.SUBMIT_LIST + 
      ' WHERE uid = ?'  
    
    db.query(query, [ userId ], (error, rows, fields) => {
      if (error) {
        reject({message: message.INTERNAL_SERVER_ERROR})
      } else {
        let pageUrl = redirectModel.checkUncompletedPage(rows[0])
        resolve(pageUrl)
      }
    })
  })
}

/**
 * Check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function login(authData) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.USER_LIST + ' WHERE email = ? '

    db.query(query, [ authData.email ], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          bcrypt.compare(authData.password, rows[0].password, function(error, result) {
            if (error) {
              reject({ message: message.INVALID_PASSWORD })
            } else {
              if (result) {
                let extraData = { fromWhere: authData.fromWhere }
                visitModel.checkVisitSessionWithExtraInfo(db, rows[0].id, false, false, true, extraData).then((result) =>{
                  // Get uncompleted page url
                  authModel.checkUncompletedPage(rows[0].id).then((url)=>{
                    resolve({ id:rows[0].id, url:url})  
                  }).catch((err) => {
                    reject(err)
                  })  
                })
              } else {
                reject({ message: message.INVALID_PASSWORD })
              }
            }                
          })
        } else {
          reject({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Store the response for signup or login with social
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function log4Social(logData) {
  let query = `INSERT INTO ${table.LOG_FOR_SOCIAL}(social_type, action_type, response, status) VALUES(?, ?, ?, ?)`
  return new Promise((resolve, reject) => {
    db.query(query, [logData.socialType, logData.actionType, logData.response, logData.status], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that register user infomation like email and password.
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  Boolean if success returns true else returns message. 
 */
function signup(user) {
  return new Promise((resolve, reject) => {
    let extraData = { fromWhere: user.fromWhere}
    let submitInfo = {
      email: user.email,
      firstName: '',
      lastName: ''
    }

    let query = 'SELECT * FROM ' + table.USER_LIST + ' WHERE email = ? '

    db.query(query, [ user.email ], (error, rows, fields) => {
      let password = bcrypt.hashSync(user.password)
      let pageUrl = ''

      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else if (rows.length > 0) {
        if ((rows[0].password === null) || (rows[0].password === '')) {
          let query = 'UPDATE ' + table.USER_LIST + ' SET password = ? WHERE email = ? '

          db.query(query, [ password, user.email ], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              visitModel.checkVisitSessionWithExtraInfo(db, rows[0].id, false, submitInfo, true, extraData).then((result) =>{
                authModel.checkUncompletedPage(rows[0].id).then((url)=>{
                  resolve({ id:rows[0].id, url:url, landing: true })
                }).catch((err) => {
                  reject(err)
                })
              })
            }
          })
        } else {
          reject({ message: message.USER_EMAIL_DUPLICATED })
        }
      } else {
        if (user.landing) {  
          let query = 'SELECT * FROM ' + table.USER_LIST + ' WHERE id = ? '

          db.query(query, [ user.userId ], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              if (rows.length > 0) {
                if ((rows[0].email === '') && ((rows[0].fb_id === null) || (rows[0].fb_id === '')) && ((rows[0].google_id === null) || (rows[0].google_id === ''))) {
                  pageUrl = 'submit/test_choice'
                  let query = 'UPDATE ' + table.USER_LIST + ' SET password = ?, email = ? WHERE id = ? '

                  db.query(query, [ password, user.email, user.userId ], (error, rows, fields) => {
                    if (error) {
                      reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                      visitModel.checkVisitSessionWithExtraInfo(db, user.userId, false, submitInfo, false, extraData).then((result) =>{
                        // save submit notification info
                        authModel.saveSubmitNotification(user.userId).then((result) => {
                          // Get uncompleted page url
                          authModel.checkUncompletedPage(user.userId).then((url)=>{
                            resolve({ id:user.userId, url:url, landing: true })
                          }).catch((err) => {
                            reject(err)
                          })    
                        }).catch((err) => {
                          reject(err)
                        })
                      })
                    }
                  })
                } else {
                  pageUrl = 'login'
                  resolve({ id:user.userId, url:pageUrl, landing: true })
                }
              } else {
                pageUrl = 'login'
                resolve({ id:user.userId, url:pageUrl, landing: true })
              }
            }
          })
        } else {
          let query = 'INSERT INTO ' + table.USER_LIST + ' (email, password) VALUES (?, ?)'

          db.query(query, [ user.email, password ], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              let userId = rows.insertId
              visitModel.checkVisitSessionWithExtraInfo(db, userId, false, submitInfo, true, extraData).then((result) =>{
                // save submit notification info
                authModel.saveSubmitNotification(userId).then((result) => {
                  resolve({ id:userId, url:pageUrl, landing: false })
                }).catch((err) => {
                  reject(err)
                })
              })
            }
          })
        }
      }
    })
  })
}

/**
 * Function that save user email notification info
 *
 * @author  DongTuring <dong@turing.com>
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveSubmitNotification(userId) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.SUBMIT_NOTIFICATION + ' WHERE uid = ?'

    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({message: message.INTERNAL_SERVER_ERROR})
      } else {
        if (rows.length === 0) {
          let query = 'INSERT INTO ' + table.SUBMIT_NOTIFICATION + ' (uid, after_15mins, after_3days, after_6days, after_9days) VALUES (?, ?, ?, ?, ?)'
          let after15Mins = new Date()
          after15Mins.setMinutes(after15Mins.getMinutes() + 15)
          let after3days = new Date()
          after3days.setDate(after3days.getDate() + 3)
          let after6days = new Date()
          after6days.setDate(after6days.getDate() + 6)
          let after9days = new Date()
          after9days.setDate(after9days.getDate() + 9)

          db.query(query, [userId, after15Mins, after3days, after6days, after9days], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        } else {
          resolve(true)
        }
      }
    })
  })
}

/**
 * Function that reset user's account with new password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   int userId
 * @param   string newPass
 * @return  boolean if success returns true else returns message
 */
function resetPass(id, newPass) {
  return new Promise((resolve, reject) => {
    let password = bcrypt.hashSync(newPass)
    let query = 'UPDATE ' + table.USER_LIST + ' SET password = ? WHERE id = ? '

    db.query(query, [ password, id ], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
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
 * @param   string token
 * @return  string 
 */
function getUidByToken(token) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT uid FROM ' + table.MAIL_TOKEN + ' WHERE token = ?'

    db.query(query, [token], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (rows.length >0) {
          resolve(rows[0].uid)
        } else {
          resolve(false)
        }
      }
    })
  })
}

/**
 * Function that get redirect url by mail token
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string token
 * @param   int type
 * @return  string 
 */
function getRedirectUrlFromMailToken(token) {
  return new Promise((resolve, reject) => {
    authModel.getUidByToken(token).then((uid) => {
      if (uid) {
        authModel.checkUncompletedPage(uid).then((pageUrl) => {
          let landing = false
          if (pageUrl !== '') {
            landing = true
          }
          resolve({ uid:uid, url: pageUrl, landing: landing })
        }).catch((err) => {
          reject(err)
        })
      } else {
        reject({message: message.ACCOUNT_NOT_EXIST})
      }
    }).catch((err) => {
      reject(err)
    })
  })  
}

/**
 * Function that get redirect url by mail token
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string token
 * @param   int type
 * @return  json 
 */
function unsubscribe(token, type, value) {
  return new Promise((resolve, reject) => {
    authModel.getUidByToken(token).then((uid) => {
      if (uid) {
        authModel.setUnsubscribed(value, uid).then((result) => {
          resolve(result)
        })
      } else {
        reject({message: message.ACCOUNT_NOT_EXIST})
      }
    }).catch((err) => {
      reject(err)
    })
  })  
}

/**
 * Function that handles unsubscription
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   obj data
 * @return  json 
 */
function unsubscribeTuringEmail(data) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, email FROM ' + table.SUBSCRIPTION + ' WHERE email = ?';
    db.query(query, [data.email], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if(rows.length > 0) {
          let subStatus = rows[0];
          let updateQuery = 'UPDATE ' + table.SUBSCRIPTION + ' SET subscription_status = ? WHERE id = ?';
          db.query(updateQuery, [data.subscription_status, subStatus.id], (error, rows, fields) => {
          })
        } else {
          let saveQuery = 'INSERT INTO ' + table.SUBSCRIPTION + '(email, subscription_status) VALUES (?, ?)';
          db.query(saveQuery, [data.email, data.subscription_status], (error, rows, fields) => {
          })
        }
      }
    });

    if(data.subscription_status === 0 ) {
      const reqBody = {
        "recipient_emails": [
          data.email
        ]
      };
      request.body = reqBody;
      request.method = 'POST';
      request.url = '/v3/asm/suppressions/global';
      client.request(request)
        .then(([response, body]) => {
          resolve(true);
        }).catch(err => {
          resolve(false);
        });
    } else {
      request.method = 'DELETE';
      request.url = '/v3/asm/suppressions/global/' + data.email;
      client.request(request)
      .then(([response, body]) => {
        resolve(true);
      }).catch(err => {
        resolve(false);
      });
    }
  })  
}

/**
 * Function that set unsubscribe
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string token
 * @return  string 
 */
function setUnsubscribed(value, uid) {
  return new Promise((resolve, reject) => {
    let query = 'UPDATE ' + table.SUBMIT_NOTIFICATION + ' SET unsubscribed = ? WHERE uid = ? '

    db.query(query, [value, uid], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function for logout
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string token
 * @return  string 
 */
function logout(uid, status) {
  return new Promise((resolve, reject) => {
    let extraData = { logoutStatus : status }
    visitModel.checkVisitSessionExtra(db, uid, extraData, 0).then((result) =>{
      resolve(result)
    })
  })
}

/**
 * Check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function loginForAdmin(authData) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.ADMIN_LIST + ' WHERE user_id = ? '

    db.query(query, [ authData.userId ], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          bcrypt.compare(authData.password, rows[0].password, function(error, result) {
            if (error) {
              reject({ message: message.INVALID_PASSWORD })
            } else {
              if (result) {
                resolve({uid: rows[0].id})          
              } else {
                reject({ message: message.INVALID_PASSWORD })
              }
            }                
          })
        } else {
          reject({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Get hash password 
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object password
 * @return  object If success returns object else returns message
 */
function getPassword(password) {
  return new Promise((resolve, reject) => {
    let hashPassword = bcrypt.hashSync(password)
    resolve(hashPassword)
  })
}

/**
 * Function that reset user's account with new password
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   int userId
 * @param   string apiKey
 * @return  boolean if success returns true else returns message
 */
function createApiKey(adminId, apiKey) {
  return new Promise((resolve, reject) => {
    var hash = crypto.createHash('sha256').update(apiKey).digest('base64');
    let query = 'INSERT INTO ' + table.API_KEY + ' (admin_id, api_key) VALUES (?, ?)'
    db.query(query, [ adminId, hash ], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(apiKey)
      }
    })
  })
}

/**
 * Function that reset user's account with new password
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   int userId
 * @param   string apiKey
 * @return  boolean if success returns true else returns message
 */
function apiKeyExists(apiKey) {
  return new Promise((resolve, reject) => {
    var hash = crypto.createHash('sha256').update(apiKey).digest('base64');
    let query = 'SELECT api_key FROM ' + table.API_KEY + ' WHERE api_key = ?'
    db.query(query, [hash], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (rows.length >0) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}

function accessTokenExists(token) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT api_key FROM ' + table.API_KEY + ' WHERE api_key = ?'
    db.query(query, [token], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (rows.length >0) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}

module.exports = authModel
