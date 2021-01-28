/**
 * Auth middleware file
 *
 * @package   backend/src/middleware
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var jwt = require('jsonwebtoken')
var message  = require('../constants/message')
var code  = require('../constants/code')
var key  = require('../config/key-config')

/**
 * Function that check auth token
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @param   object next
 * @return  json if auth token is invalid returns json else go to next()
 */
function checkToken(req, res, next) {
  let token = req.headers['authorization'] 

  if (token !== undefined) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length)
    }

    jwt.verify(token, key.JWT_SECRET_KEY, (err, decoded) => { 
      if (err) {
        return res.json({
          code: code.UNAUTHORIZED,
          message: message.INVALID_AUTH_TOKEN,
          data: {}
        })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.json({
      code: code.UNAUTHORIZED,
      message: message.INVALID_AUTH_TOKEN,
      data: {}
    })
  }
}

/**
 * Function that check auth token
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @param   object next
 * @return  json if auth token is invalid returns json else go to next()
 */
function checkAdminToken(req, res, next) {
  let token = req.headers['authorization'] 

  if (token !== undefined) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length)
    }

    jwt.verify(token, key.JWT_SECRET_KEY, (err, decoded) => { 
      if (err) {
        return res.json({
          code: code.UNAUTHORIZED,
          message: message.INVALID_AUTH_TOKEN,
          data: {}
        })
      } else {
        if (decoded.admin) {
          req.decoded = decoded
          next()
        } else {
          return res.json({
            code: code.UNAUTHORIZED,
            message: message.INVALID_AUTH_TOKEN,
            data: {}
          })
        }
      }
    })
  } else {
    return res.json({
      code: code.UNAUTHORIZED,
      message: message.INVALID_AUTH_TOKEN,
      data: {}
    })
  }
}

/**
 * Function that check auth token for sign up
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @param   object next
 * @return  json if auth token is invalid returns json else go to next()
 */
function checkTokenForSignup(req, res, next) {
  let token = req.headers['authorization']
  if (token !== undefined) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length)
    }

    jwt.verify(token, key.JWT_SECRET_KEY, (err, decoded) => { 
      if (err) {
        return res.json({
          code: code.UNAUTHORIZED,
          message: message.INVALID_AUTH_TOKEN,
          data: {}
        })
      } else {
        req.decoded = decoded
        req.landing = decoded.landing
        next()
      }
    })
  } else {
    req.landing = false
    next()
  }
}

/**
 * Function that check auth token for LinkedIn
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @param   object next
 * @return  json if auth token is invalid returns json else go to next()
 */
function checkTokenForLinkedIn(req, res, next) {
  let token = req.query.token
  if (token !== undefined) {
    jwt.verify(token, key.JWT_SECRET_KEY, (err, decoded) => { 
      if (err) {
        next()
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    next()
  }
}

module.exports = {
  checkToken: checkToken,
  checkTokenForSignup: checkTokenForSignup,
  checkTokenForLinkedIn: checkTokenForLinkedIn,
  checkAdminToken: checkAdminToken
}
