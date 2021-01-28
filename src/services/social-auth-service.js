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

var socialAuthModel = require('../models/social-auth-model')
var jwt = require('jsonwebtoken')
var message = require('../constants/message')
var code = require('../constants/code')
var key = require('../config/key-config')
const request = require('superagent')
var timer  = require('../constants/timer')

var socialAuthService = {
  loginWithGoogle: loginWithGoogle,
  loginWithFacebook: loginWithFacebook,
  saveLinkedinData: saveLinkedinData,
  saveLinkedinStatus: saveLinkedinStatus,
  saveGoogleData: saveGoogleData,
  saveFacebookData: saveFacebookData,
  getGithubData: getGithubData,
  saveGoogleFailedStatus: saveGoogleFailedStatus,
  saveFacebookFailedStatus: saveFacebookFailedStatus
}

/**
 * Function that login with google user account
 *
 * @author  DongTuring  <dong@turing.com>
 * @return   
 */
function loginWithGoogle(authData) {
  return new Promise((resolve, reject) => {
    socialAuthModel.loginWithGoogle(authData).then((data) => {
      if (data) {
        let userId = data.id
        let token = jwt.sign({ uid: userId, landing: true }, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })
        resolve({ code: code.OK, message: '', data: { 'token': token, 'url': data.url, landing: true } })
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
 * Function that save google account
 *
 * @author  YingTuring  <ying@turing.com>
 * @return   
 */
function saveGoogleData(data) {
  return new Promise((resolve, reject) => {
    socialAuthModel.saveDataFromGoogle(data.user, data.userId, false).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: {} })
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
 * Function that save google failed status
 *
 * @author  DongTuring  <dong@turing.com>
 * @return   
 */
function saveGoogleFailedStatus(data) {
  return new Promise((resolve, reject) => {
    socialAuthModel.saveGoogleFailedStatus(data.user, data.userId).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: {} })
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
 * Function that login with facebook user account
 *
 * @author  DongTuring  <dong@turing.com>
 * @return   
 */
function loginWithFacebook(authData) {
  return new Promise((resolve, reject) => {
    socialAuthModel.loginWithFacebook(authData).then((data) => {
      if (data) {
        let userId = data.id
        let token = jwt.sign({ uid: userId, landing: true }, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })
        resolve({ code: code.OK, message: '', data: { 'token': token, 'url': data.url, landing: true } })
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
 * Function that save facebook account
 *
 * @author  YingTuring  <ying@turing.com>
 * @return   
 */
function saveFacebookData(data) {
  return new Promise((resolve, reject) => {
    socialAuthModel.saveDataFromFacebook(data.user, data.userId, false).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: {} })
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
 * Function that save facebook failed status
 *
 * @author  DongTuring  <dong@turing.com>
 * @return   
 */
function saveFacebookFailedStatus(data) {
  return new Promise((resolve, reject) => {
    socialAuthModel.saveFacebookFailedStatus(data.user, data.userId).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: {} })
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
 * Function that save linkedin account data
 *
 * @author  DongTuring  <dong@turing.com>
 * @return   
 */
function saveLinkedinData(data) {
  return new Promise((resolve, reject) => {
    socialAuthModel.saveDataAllFromLinkedin(data.user, data.userId).then((result) => {
      if (result) {
        resolve(result)
      }
    })
  })
}

/**
 * Function that save linkedin account status
 *
 * @author  DongTuring  <dong@turing.com>
 * @return   
 */
function saveLinkedinStatus(data) {
  return new Promise((resolve, reject) => {
    socialAuthModel.saveLinkedinStatus(data).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: {} })
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
 * Function that get github account data
 *
 * @author  YingTuring  <ying@turing.com>
 * @return   
 */
function getGithubData(data) {
  var clientId = data.githubId
  var clientSecret = data.githubSecret
  return new Promise((resolve, reject) => {
    request
      .post('https://github.com/login/oauth/access_token')
      .send({
        client_id: clientId,
        client_secret: clientSecret,
        code: data.code
      })
      .set('Accept', 'application/json')
      .then((res) => {
        const accessToken = res.body.access_token

        request
          .get('https://api.github.com/user')
          .set('Authorization', 'token ' + accessToken)
          .then((result) => {
            const githubData = result.body
            socialAuthModel.saveGithubData(githubData, data.userId).then((result) => {
              if (result) {
                resolve({ code: code.OK, message: '', data: {} })
              }
            }).catch((err) => {
              if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
              else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
          })
          .catch((err) => {
            reject({ code: code.SERVICE_UNAVAILABLE, message: err.message})
          })
      })
      .catch((err) => {
        reject({ code: code.SERVICE_UNAVAILABLE, message: err.message})
      })
  })
}

/**
 * Function that save github account data
 *
 * @author  YingTuring  <ying@turing.com>
 * @return   
 */
function saveGithubData(githubData, userId) {
  return new Promise((resolve, reject) => {
    socialAuthModel.saveGithubData(githubData, userId).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: {} })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

module.exports = socialAuthService