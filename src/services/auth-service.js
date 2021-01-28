/**
 * Auth service file
 * 
 * @package   backend/src/services
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth/
 */

var authModel = require('../models/auth-model')
var jwt = require('jsonwebtoken')
var message = require('../constants/message')
var code = require('../constants/code')
var key = require('../config/key-config')
var timer  = require('../constants/timer')

var authService = {
  getRedirectUrl: getRedirectUrl,
  log4Social: log4Social,
  login: login,
  loginForAdmin: loginForAdmin,
  signup: signup,
  resetPass: resetPass,
  getRedirectUrlFromMailToken: getRedirectUrlFromMailToken,
  unsubscribe: unsubscribe,
  logout: logout, 
  getPassword: getPassword,
  unsubscribeTuringEmail: unsubscribeTuringEmail,
  createApiKey: createApiKey
}

/**
 * Function that get redirect url to go uncompleted page
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function getRedirectUrl(userId) {
  return new Promise((resolve, reject) => {
    authModel.checkUncompletedPage(userId).then((pageUrl) => {
      resolve({ code: code.OK, message: '', data: { 'url': pageUrl } })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get redirect url to go uncompleted page
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function getRedirectUrlFromMailToken(token) {
  return new Promise((resolve, reject) => {
    authModel.getRedirectUrlFromMailToken(token).then((data) => {
      if (data) {
        let userId = data.uid
        let token = jwt.sign({ uid: userId, landing: data.landing}, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })
        
        resolve({ code: code.OK, message: '', data: { 'token': token, 'url': data.url, landing: data.landing } })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  json 
 */
function login(authData) {
  return new Promise((resolve, reject) => {
    authModel.login(authData).then((data) => {
      if (data) {
        let userId = data.id
        let token = jwt.sign({ uid: userId, landing: true }, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })
        
        resolve({ code: code.OK, message: '', data: { 'token': token, 'url': data.url } })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that log for signup or login with social
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object logData
 * @return  json 
 */
function log4Social(logData) {
  return new Promise((resolve, reject) => {
    authModel.log4Social(logData).then((res) => {
      resolve({ code: code.OK, message: '' })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message })
      else
        reject({ code: code.BAD_REQUEST, message: err.message })
    })
  })
}

/**
 * Function that registers user info like email and pass
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  json 
 */
function signup(user) {
  return new Promise((resolve, reject) => {
    authModel.signup(user).then((data) => {
      if (data) {
        let userId = data.id
        let token = jwt.sign({ uid: userId, landing: data.landing }, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })

        resolve({ code: code.CREATED, message: '', data: { 'token': token, 'url': data.url, 'landing': data.landing } })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR) {
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      } else {
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
      }
    })
  })
}

/**
 * Function that reset password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  json 
 */
function resetPass(data) {
  return new Promise((resolve, reject) => {
    // get user id by token
    authModel.getUidByToken(data.token).then((uid) => {
      if (uid) {
        // reset pass
        authModel.resetPass(uid, data.password).then((result) => {
          if (result) {
            resolve({ code: code.OK, message: '', data: {} })
          } else {
            reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
          }
        }).catch((err) => {
          if (err.message === message.INTERNAL_SERVER_ERROR) {
            reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
          } else {
            reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
          }
        })
      } else {
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR) {
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      } else {
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
      }
    })
  })
}

/**
 * Function to unsubscribe
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function unsubscribe(token, type, value) {
  return new Promise((resolve, reject) => {
    authModel.unsubscribe(token, type, value).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: {} })
      } else {
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function to unsubscribe from turing emails
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param obj
 * @return  string 
 */
function unsubscribeTuringEmail(data) {
  return new Promise((resolve, reject) => {
    authModel.unsubscribeTuringEmail(data).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: {} })
      } else {
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function to logout
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function logout(userId, status) {
  return new Promise((resolve, reject) => {
    authModel.logout(userId, status).then((result) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  json 
 */
function loginForAdmin(authData) {
  return new Promise((resolve, reject) => {
    authModel.loginForAdmin(authData).then((data) => {
      if (data) {
        let token = jwt.sign({ admin: true, uid: data.uid }, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })
        
        resolve({ code: code.OK, message: '', data: { 'token': token } })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get hashed password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string password
 * @return  json 
 */
function getPassword(password) {
  return new Promise((resolve, reject) => {
    authModel.getPassword(password).then((hashedpassword) => {
      if (hashedpassword) {
        resolve({ password: hashedpassword })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get hashed password
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number uid
 * @param   string apiKey
 * @return  json 
 */
function createApiKey(adminId, apiKey) {
  return new Promise((resolve, reject) => {
    authModel.createApiKey(adminId, apiKey).then((apiToken) => {
      if (apiToken) {
        resolve({ apiToken: apiToken })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

module.exports = authService
