/**
 * Social auth model file
 *
 * @package   backend/src/models
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var db = require('../database/database')
var message = require('../constants/message')
var table = require('../constants/table')
var redirectModel = require('./redirect-model')
var visitModel = require('./visit-model')

var socialAuthModel = {
  saveSubmitNotification: saveSubmitNotification,
  checkUncompletedPage: checkUncompletedPage,
  loginWithGoogle: loginWithGoogle,
  loginWithFacebook: loginWithFacebook,
  saveSubmitData: saveSubmitData,
  saveGoogleData: saveGoogleData,
  saveDataAllFromGoogle: saveDataAllFromGoogle,
  saveFBData: saveFBData,
  saveDataAllFromFB: saveDataAllFromFB,
  saveLinkedinData: saveLinkedinData,
  saveLinkedinStatus: saveLinkedinStatus,
  saveSubmitLinkedinData: saveSubmitLinkedinData,
  saveDataAllFromLinkedin: saveDataAllFromLinkedin,
  saveGithubData: saveGithubData,
  saveGoogleFailedStatus: saveGoogleFailedStatus,
  saveFacebookFailedStatus: saveFacebookFailedStatus,
  saveDataFromGoogle: saveDataFromGoogle,
  saveDataFromFacebook: saveDataFromFacebook
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

    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let pageUrl = redirectModel.checkUncompletedPage(rows[0])
        resolve(pageUrl)
      }
    })
  })
}

/**
 * Function that save submit data from google
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveSubmitData(user, id) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'

    db.query(query, [id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          if (((rows[0].email === '') || (rows[0].email === null)) && (rows[0].first_name === '') && (rows[0].last_name === '')) {
            let query = 'UPDATE ' + table.SUBMIT_LIST + ' SET email= ?, first_name = ?, last_name = ? WHERE uid = ?'

            db.query(query, [user.email, user.firstName, user.lastName, id], (error, result, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
              } else {
                resolve(true)
              }
            })
          } else {
            resolve(true)
          }
        } else {
          let query = 'INSERT INTO ' + table.SUBMIT_LIST + '(uid, email, first_name, last_name) VALUES (?, ?, ?, ?)'

          db.query(query, [id, user.email, user.firstName, user.lastName], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }
      }
    })
  })
}

/**
 * Function that save submit data from google
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveSubmitLinkedinData(user, id) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'

    db.query(query, [id], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (rows.length > 0) {
          if ((rows[0].first_name === '') && (rows[0].last_name === '')) {
            let query = 'UPDATE ' + table.SUBMIT_LIST + ' SET first_name = ?, last_name = ? WHERE uid = ?'
            db.query(query, [user.firstName, user.lastName, id], (error, result, fields) => {
              if (error) {
                resolve(false)
              } else {
                resolve(true)
              }
            })
          } else {
              resolve(true)
          }
        } else {
            resolve(true)
        }
      }
    })
  })
}

/**
 * Function that save data from google
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveGoogleData(user, id) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.GOOGLE_LIST + ' WHERE ouid = ?'

    db.query(query, [id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          let query = 'UPDATE ' + table.GOOGLE_LIST + ' SET oemail= ?, ofirst_name = ?, olast_name = ?, ouser_id = ?, oerror_code = ? WHERE ouid = ?'

          db.query(query, [user.email, user.firstName, user.lastName, user.googleId, 'success', id], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        } else {
          let query = 'INSERT INTO ' + table.GOOGLE_LIST + '(ouid, oemail, ofirst_name, olast_name, ouser_id, oerror_code) VALUES (?, ?, ?, ?, ?, ?)'

          db.query(query, [id, user.email, user.firstName, user.lastName, user.googleId, 'success'], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }
      }
    })
  })
}

/**
 * Function that save failed status from google
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveGoogleFailedStatus(user, id) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.GOOGLE_LIST + ' WHERE ouid = ?'

    db.query(query, [id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          let query = 'UPDATE ' + table.GOOGLE_LIST + ' SET oemail= ?, ofirst_name = ?, olast_name = ?, ouser_id = ?, oerror_code = ? WHERE ouid = ?'

          db.query(query, [user.email, user.firstName, user.lastName, user.googleId, 'don\'t_have_account', id], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        } else {
          let query = 'INSERT INTO ' + table.GOOGLE_LIST + '(ouid, oemail, ofirst_name, olast_name, ouser_id, oerror_code) VALUES (?, ?, ?, ?, ?, ?)'

          db.query(query, [id, user.email, user.firstName, user.lastName, user.googleId, 'don\'t_have_account'], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }
      }
    })
  })
}

/**
 * Function that save data from google
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveFacebookFailedStatus(user, id) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.FACEBOOK_LIST + ' WHERE fuid = ?'

    db.query(query, [id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          let query = 'UPDATE ' + table.FACEBOOK_LIST + ' SET femail= ?, ffirst_name = ?, flast_name = ?, fuser_id = ?, ferror_code = ? WHERE fuid = ?'

          db.query(query, [user.email, user.firstName, user.lastName, user.id, 'don\'t_have_account', id], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        } else {
          let query = 'INSERT INTO ' + table.FACEBOOK_LIST + '(fuid, femail, ffirst_name, flast_name, fuser_id, ferror_code) VALUES (?, ?, ?, ?, ?, ?)'

          db.query(query, [id, user.email, user.firstName, user.lastName, user.id, 'don\'t_have_account'], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }
      }
    })
  })
}

/**
 * Function that save data from google
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveFBData(user, id) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.FACEBOOK_LIST + ' WHERE fuid = ?'

    db.query(query, [id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          let query = 'UPDATE ' + table.FACEBOOK_LIST + ' SET femail= ?, ffirst_name = ?, flast_name = ?, fuser_id = ?, ferror_code = ? WHERE fuid = ?'

          db.query(query, [user.email, user.firstName, user.lastName, user.id, 'success', id], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        } else {
          let query = 'INSERT INTO ' + table.FACEBOOK_LIST + '(fuid, femail, ffirst_name, flast_name, fuser_id, ferror_code) VALUES (?, ?, ?, ?, ?, ?)'

          db.query(query, [id, user.email, user.firstName, user.lastName, user.id, 'success'], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }
      }
    })
  })
}

/**
 * Function that save data from google
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveLinkedinData(user, id) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.LINKEDIN_LIST + ' WHERE luid = ?'

    let values = [
      user.firstName,
      user.lastName,
      user.id,
      user.emailAddress,
      user.errorCode,
      id
    ]

    db.query(query, [id], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (rows.length > 0) {
          let query = 'UPDATE ' + table.LINKEDIN_LIST + ' SET ' +
            'lfirst_name= ?, ' +
            'llast_name = ?, ' +
            'luser_id = ?, ' +
            'lemail = ?, ' +
            'lerror_code = ? ' +
            'WHERE luid = ?'

          db.query(query, values, (error, result, fields) => {
            if (error) {
              resolve(false)
            } else {
              resolve(true)
            }
          })
        } else {

          let query = 'INSERT INTO ' + table.LINKEDIN_LIST + ' (' +
            'lfirst_name, ' +
            'llast_name, ' +
            'luser_id, ' +
            'lemail, ' +
            'lerror_code, ' +
            'luid ) ' +
            'VALUES (?, ?, ?, ?, ?, ?) '

          db.query(query, values, (error, result, fields) => {
            if (error) {
              resolve(false)
            } else {
              resolve(true)
            }
          })
        }
      }
    })
  })
}

/**
 * Function that save data from google
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveDataAllFromGoogle(user, id, isLogin) {
  return new Promise((resolve, reject) => {
    let extraData = { registerGoogle: 1, fromWhere: user.fromWhere }
    let submitInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }

    visitModel.checkVisitSessionWithExtraInfo(db, id, false, submitInfo, isLogin, extraData).then((result) =>{
      if (result) {
        // insert google_list_V4
        socialAuthModel.saveGoogleData(user, id).then((result)=>{
          resolve(result)
        }).catch((err) => {
          reject(err)
        })  
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Function that save data from facebook
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveDataAllFromFB(user, id, isLogin) {
  return new Promise((resolve, reject) => {
    let extraData = { registerFacebook: 1, fromWhere: user.fromWhere}
    let submitInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }

    visitModel.checkVisitSessionWithExtraInfo(db, id, false, submitInfo, isLogin, extraData).then((result) =>{
      if (result) {
        // insert facebook_list_V4
        socialAuthModel.saveFBData(user, id).then((result)=>{
          resolve(result)
        }).catch((err) => {
          reject(err)
        })  
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Function that save data from facebook
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveDataAllFromLinkedin(user, id) {
  return new Promise((resolve, reject) => {
    // insert submit_list_v4
    socialAuthModel.saveSubmitLinkedinData(user, id).then((result) => {
      if (result) {
        // insert linkedin_list_v4
        socialAuthModel.saveLinkedinData(user, id).then((result) => {
          if (result) {
            let extraData = { registerLinkedin: 1 }
            visitModel.checkVisitSessionExtra(db, id, extraData, 0).then((result) =>{
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
  })
}

/**
 * Check user login status with user google account
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function loginWithGoogle(authData) {
  return new Promise((resolve, reject) => {
    let pageUrl = ''
    let uid
    let resolveValue = {}
    let extraData = { registerGoogle: 1, fromWhere: authData.user.fromWhere }
    let submitInfo = {
      firstName: authData.user.firstName,
      lastName: authData.user.lastName,
      email: authData.user.email
    }

    let query = 'SELECT * FROM ' + table.USER_LIST + ' WHERE email = ?'

    db.query(query, [authData.user.email], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) { // if email already existed
          if (rows[0].google_id === authData.user.googleId) {
            visitModel.checkVisitSessionWithExtraInfo(db, rows[0].id, false, submitInfo, 1, extraData).then((result) =>{
              socialAuthModel.checkUncompletedPage(rows[0].id).then((url) => {
                if (url === '') {
                  resolve({ id: rows[0].id, url: url, landing: false })
                } else {
                  resolve({ id: rows[0].id, url: url, landing: true })
                }
              })
            })
          } else {
            // Update user list table with google user info
            let query = 'UPDATE ' + table.USER_LIST + ' SET google_id = ? WHERE id = ?'

            db.query(query, [authData.user.googleId, rows[0].id], (error, result, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
              } else {
                uid = rows[0].id;
                socialAuthModel.saveDataAllFromGoogle(authData.user, uid, true).then((result) => {
                  socialAuthModel.checkUncompletedPage(rows[0].id).then((url) => {
                    if (url === '') {
                      resolve({ id: uid, url: url, landing: false })
                    } else {
                      resolve({ id: uid, url: url, landing: true })
                    }
                  })
                }).catch((err) => {
                  reject(err)
                })
              }
            })
          }
        } else {
          // Insert user info to user list table
          if (authData.landing) {
            let query = 'UPDATE ' + table.USER_LIST + ' SET google_id = ?, email = ? WHERE id = ?'

            db.query(query, [authData.user.googleId, authData.user.email, authData.userId], (error, rows, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
              } else {
                uid = authData.userId
                socialAuthModel.saveDataAllFromGoogle(authData.user, uid, false).then((result) => {
                  // save submit notification info
                  socialAuthModel.saveSubmitNotification(uid).then((result) => {
                    socialAuthModel.checkUncompletedPage(uid).then((url) => {
                      resolveValue = { id: uid, url: url, landing: true }
                      resolve(resolveValue)
                    }).catch((err) => {
                      reject(err)
                    })    
                  }).catch((err) => {
                    reject(err)
                  })
                }).catch((err) => {
                  reject(err)
                })
              }
            })
          } else {
            let query = 'INSERT INTO ' + table.USER_LIST + ' (google_id, email) VALUES(?, ?)'

            db.query(query, [authData.user.googleId, authData.user.email], (error, rows, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
              } else {
                uid = rows.insertId
                socialAuthModel.saveDataAllFromGoogle(authData.user, uid, true).then((result) => {
                  // save submit notification info
                  socialAuthModel.saveSubmitNotification(uid).then((result) => {
                    resolveValue = { id: uid, url: pageUrl, landing: authData.landing }
                    resolve(resolveValue)
                  }).catch((err) => {
                    reject(err)
                  })
                }).catch((err) => {
                  reject(err)
                })
              }
            })
          }
        }
      }
    })
  })
}

/**
 * Check user login status with user facebook account
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function loginWithFacebook(authData) {
  return new Promise((resolve, reject) => {
    let pageUrl = ''
    let uid
    let resolveValue = {}
    let extraData = { registerFacebook: 1, fromWhere: authData.user.fromWhere }
    let submitInfo = {
      firstName: authData.user.firstName,
      lastName: authData.user.lastName,
      email: authData.user.email
    }

    let query = 'SELECT * FROM ' + table.USER_LIST + ' WHERE email = ?'

    db.query(query, [authData.user.email], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) { // if email already existed
          if (rows[0].fb_id === authData.user.id) {
            visitModel.checkVisitSessionWithExtraInfo(db, rows[0].id, false, submitInfo, 1, extraData).then((result) =>{
              socialAuthModel.checkUncompletedPage(rows[0].id).then((url) => {
                if (url === '') {
                  resolve({ id: rows[0].id, url: url, landing: false })
                } else {
                  resolve({ id: rows[0].id, url: url, landing: true })
                }
              })
            })
          } else {
            // Update user list table with google user info
            let query = 'UPDATE ' + table.USER_LIST + ' SET fb_id = ? WHERE id = ?'

            db.query(query, [authData.user.id, rows[0].id], (error, result, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
              } else {
                uid = rows[0].id;
                socialAuthModel.saveDataAllFromFB(authData.user, uid, true).then((result) => {
                  socialAuthModel.checkUncompletedPage(rows[0].id).then((url) => {
                    if (url === '') {
                      resolve({ id: uid, url: url, landing: false })
                    } else {
                      resolve({ id: uid, url: url, landing: true })
                    }
                  })
                }).catch((err) => {
                  reject(err)
                })
              }
            })
          }
        } else {
          // Insert user info to user list table
          if (authData.landing) {
            let query = 'UPDATE ' + table.USER_LIST + ' SET fb_id = ?, email = ? WHERE id = ?'

            db.query(query, [authData.user.id, authData.user.email, authData.userId], (error, rows, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
              } else {
                uid = authData.userId
                socialAuthModel.saveDataAllFromFB(authData.user, uid, false).then((result) => {
                  // save submit notification info
                  socialAuthModel.saveSubmitNotification(uid).then((result) => {
                    socialAuthModel.checkUncompletedPage(uid).then((url) => {
                      resolveValue = { id: uid, url: url, landing: true }
                      resolve(resolveValue)
                    }).catch((err) => {
                      reject(err)
                    })  
                  }).catch((err) => {
                    reject(err)
                  })
                }).catch((err) => {
                  reject(err)
                })
              }
            })
          } else {
            let query = 'INSERT INTO ' + table.USER_LIST + ' (fb_id, email) VALUES(?, ?)'

            db.query(query, [authData.user.id, authData.user.email], (error, rows, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
              } else {
                uid = rows.insertId
                resolveValue = { id: uid, url: pageUrl, landing: authData.landing }
                socialAuthModel.saveDataAllFromFB(authData.user, uid, true).then((result) => {
                  // save submit notification info
                  socialAuthModel.saveSubmitNotification(uid).then((result) => {
                    resolveValue = { id: uid, url: pageUrl, landing: authData.landing }
                    resolve(resolveValue)
                  }).catch((err) => {
                    reject(err)
                  })
                }).catch((err) => {
                  reject(err)
                })
              }
            })
          }
        }
      }
    })
  })
}

/**
 * Function that save linkedin status
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object data
 * @return  boolean if success returns true else returns message
 */
function saveLinkedinStatus(data) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.LINKEDIN_LIST + ' WHERE luid = ?'

    let values = [
      data.status,
      data.userId
    ]

    db.query(query, [data.userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          let query = 'UPDATE ' + table.LINKEDIN_LIST + ' SET ' +
            'lerror_code = ? ' +
            'WHERE luid = ?'

          db.query(query, values, (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        } else {

          let query = 'INSERT INTO ' + table.LINKEDIN_LIST + ' (' +
            'lerror_code, ' +
            'luid ) ' +
            'VALUES (?, ?) '

          db.query(query, values, (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
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
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length === 0) {
          let query = 'INSERT INTO ' + table.SUBMIT_NOTIFICATION + ' (uid, after_15mins, after_3days, after_6days, after_9days) VALUES (?, ?, ?, ?, ?)'
          let after15Mins = new Date();
          after15Mins.setMinutes(after15Mins.getMinutes() + 15);
          let after3days = new Date();
          after3days.setDate(after3days.getDate() + 3);
          let after6days = new Date();
          after6days.setDate(after6days.getDate() + 6);
          let after9days = new Date();
          after9days.setDate(after9days.getDate() + 9);
          db.query(query, [userId, after15Mins, after3days, after6days, after9days], (error, result, fields) => {

            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        } else {
          resolve(true);
        }
      }
    })
  })
}

/**
 * Function that save data from github
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object github data
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveGithubData(githubData, userId) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.GITHUB_LIST + ' WHERE guid = ? AND guser_id = ?'

    db.query(query, [userId, githubData.id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let fullName = ''
        let loginName = ''
        let email = ''
        let company = ''
        let location = ''
        let bio = ''
        let profileUrl = ''
        let reposUrl = ''
        let reposCount = ''
        let followers = ''
        let following = ''
        let avatarUrl = ''
        let createDate = ''

        if (githubData.name !== null)
          fullName = githubData.name
        if (githubData.login !== null)
          loginName = githubData.login
        if (githubData.email !== null)
          email = githubData.email
        if (githubData.company !== null)
          company = githubData.company
        if (githubData.location !== null)
          location = githubData.location
        if (githubData.bio !== null)
          bio = githubData.bio
        if (githubData.html_url !== null)
          profileUrl = githubData.html_url
        if (githubData.repos_url !== null)
          reposUrl = githubData.repos_url
        if (githubData.public_repos !== null)
          reposCount = githubData.public_repos
        if (githubData.followers !== null)
          followers = githubData.followers
        if (githubData.following !== null)
          following = githubData.following
        if (githubData.avatar_url !== null)
          avatarUrl = githubData.avatar_url
        if (githubData.created_at !== null)
          createDate = githubData.created_at

        if (rows.length > 0) {
          let query = 'UPDATE ' + table.GITHUB_LIST + ' SET gfull_name= ?, glogin_name = ?, gemail = ?, gcompany = ?, glocation = ? , gbio = ?'
          +', gprofile_url = ?, grepos_url = ?, gpublic_repos_count = ?, gfollowers_count = ?, gfollowing_count = ?, gavatar_url = ?, gerror_code = ? WHERE guid = ?'

          db.query(query, [fullName, loginName, email, company, location, bio, profileUrl, reposUrl, reposCount, followers, following, avatarUrl, 'success', userId], (error, result, fields) => {
            if (error) {
              console.log(error)
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              let extraData = { registerGithub: 1 }
              visitModel.checkVisitSessionExtra(db, userId, extraData, 0).then((result) =>{
                resolve(true)
              })
            }
          })
        } else {
          let query = 'INSERT INTO ' + table.GITHUB_LIST + ' (guid, gfull_name, glogin_name, gemail, gcompany, glocation, gbio,'
            + ' gprofile_url, grepos_url, gpublic_repos_count, gfollowers_count, gfollowing_count, gavatar_url, gaccount_create_date, guser_id, gerror_code)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

          db.query(query, [userId, fullName, loginName, email, company, location, bio, profileUrl, reposUrl, reposCount, followers, following, avatarUrl, createDate, githubData.id, 'success'], (error, result, fields) => {
            if (error) {
              console.log(error)
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              let extraData = { registerGithub: 1 }
              visitModel.checkVisitSessionExtra(db, userId, extraData, 0).then((result) =>{
                resolve(true)
              })
            }
          })
        }
      }
    })
  })
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

    let query = 'SELECT * FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'

    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let pageUrl = redirectModel.checkUncompletedPage(rows[0])
        resolve(pageUrl)
      }
    })
  })
}

/**
 * Function that save data from google
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveDataFromGoogle(user, id) {
  return new Promise((resolve, reject) => {
      // insert google_list_v4
      socialAuthModel.saveGoogleData(user, id).then((result) => {
        if (result) {
          let extraData = { registerGoogle: 1 }
          visitModel.checkVisitSessionExtra(db, id, extraData, 0).then((result) =>{
            resolve(result)
          })
        }
      }).catch((err) => {
        reject(err)
      })
  })
}

/**
 * Function that save data from facebook
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveDataFromFacebook(user, id) {
  return new Promise((resolve, reject) => {
      // insert linkedin_list_v4
      socialAuthModel.saveFBData(user, id).then((result) => {
        if (result) {
          let extraData = { registerFacebook: 1 }
          visitModel.checkVisitSessionExtra(db, id, extraData, 0).then((result) =>{
            resolve(result)
          })
        }
      }).catch((err) => {
        reject(err)
      })
  })
}

/**
 * Function that save data from facebook
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @param   int userId
 * @return  boolean if success returns true else returns message
 */
function saveDataAllFromLinkedin(user, id) {
  return new Promise((resolve, reject) => {
    // insert submit_list_v4
    socialAuthModel.saveSubmitLinkedinData(user, id).then((result) => {
      if (result) {
        // insert linkedin_list_v4
        socialAuthModel.saveLinkedinData(user, id).then((result) => {
          if (result) {
            let extraData = { registerLinkedin: 1 }
            visitModel.checkVisitSessionExtra(db, id, extraData, 0).then((result) =>{
              resolve(result)
            })
          }
        }).catch((err) => {
          reject(err)
        })
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = socialAuthModel
