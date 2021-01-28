/**
 * Auth router file
 * 
 * @package   backend/src/routes
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth
 */

var express = require('express')
var router = express.Router()
var authService = require('../services/auth-service')
var authMiddleware = require('../middleware/auth-middleware')
const keyConfig = require("../config/key-config")
const uuidv4 = require('uuid/v4');

const Cryptr = require('cryptr')
const cryptr = new Cryptr(keyConfig.CRYPTR_SECRET_KEY);

/** 
 * Login api
 */
router.post('/login', login)

/** 
 * Signup api
 */
router.post('/signup', authMiddleware.checkTokenForSignup, signup)

/** 
 * Logging api for signup with social
 */
router.post('/log-for-social', log4Social)

/** 
 * Get redirect url from token 
 */
router.get('/check-url', authMiddleware.checkToken, getRedirectUrl)

/** 
 * Get redirect url from mail token 
 */
router.post('/check-mail-token', getRedirectUrlFromMailToken)

/** 
 * Reset password
 */
router.post('/reset-pass', resetPass)

/** 
 * Unsubscribe
 */
router.post('/unsubscribe', unsubscribe)

/** 
 * Unsubscribe from turing email
 */

router.post('/unsubscribe-turing-email', unsubscribeTuringEmail)

/** 
 * logout
 */
router.post('/logout', authMiddleware.checkToken, logout)

/** 
 * Admin Login api
 */
router.post('/admin/login', loginForAdmin)

/** 
 * Admin Token validation
 */
router.get('/admin/check_validation', authMiddleware.checkAdminToken, checkAdminTokenValidation)

/** 
 * Get password api
 */
router.get('/admin/get-password', getPassword)

/** 
 * create API key
 */
router.post('/admin/create-api-key', authMiddleware.checkAdminToken, createApiKey)

/**
 * Function that get redirect url to go uncompleted page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getRedirectUrl(req, res) {
  let userId = req.decoded.uid

  authService.getRedirectUrl(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get redirect url from mail token
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getRedirectUrlFromMailToken(req, res) {
  let mailToken = req.body.token

  authService.getRedirectUrlFromMailToken(mailToken).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function login(req, res) {
  let email = req.body.email
  let password = req.body.password
  let fromWhere = req.body.fromWhere 
  
  var authData = {
    email: email,
    password: password,
    fromWhere: fromWhere
  }

  authService.login(authData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that log for signup or login with social
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function log4Social(req, res) {
  let socialType = req.body.socialType
  let actionType = req.body.actionType
  let response = req.body.response
  let status = req.body.status
  
  let logData = {
    socialType,
    actionType,
    response,
    status
  }

  authService.log4Social(logData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that register user infos like email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function signup(req, res) {
  let email = req.body.email
  let password = req.body.password
  let landing = req.landing
  let fromWhere = req.body.fromWhere
  let user

  if (landing) {
    user = {
      email: email,
      password: password,
      fromWhere: fromWhere,
      landing: landing,
      userId: req.decoded.uid
    }
  } else {
    user = {
      email: email,
      password: password,
      fromWhere: fromWhere,
      landing: landing
    }
  }

  authService.signup(user).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that reset password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function resetPass(req, res) {

  var data = {
    token: req.body.token,
    password: req.body.password
  }

  authService.resetPass(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function to unsubscribe
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function unsubscribe(req, res) {
  let token = req.body.token
  let type = req.body.type
  let value = req.body.value
  authService.unsubscribe(token, type, value).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function to unsubscribe
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function unsubscribeTuringEmail(req, res) {
  const { cryptEmail, subscription_status } = req.body
  const email = cryptr.decrypt(cryptEmail)
  const data  ={
    email: email,
    subscription_status: subscription_status
  }

  authService.unsubscribeTuringEmail(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function to logout
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function logout(req, res) {
  let userId = req.decoded.uid
  let status = req.body.status
  authService.logout(userId, status).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that check admin user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function loginForAdmin(req, res) {
  let userId = req.body.userId
  let password = req.body.password
  
  var authData = {
    userId: userId,
    password: password
  }

  authService.loginForAdmin(authData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

function checkAdminTokenValidation(req, res) {
  res.json({ code: 200, message: '' })
}

/**
 * Function that get password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getPassword(req, res) {
  let password = req.query.password
  authService.getPassword(password).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get password
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function createApiKey(req, res) {
  let adminId = req.decoded.uid;
  let token = uuidv4();
  authService.createApiKey(adminId, token).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

module.exports = router
