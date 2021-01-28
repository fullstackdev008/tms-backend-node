/**
 * Statistics service file
 * 
 * @package   backend/src/services
 * @author    Zecharias <zecharias.a@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/admin/dashboard
 */

var statsModel = require('../models/stats-model')
var message = require('../constants/message')
var code = require('../constants/code')

var visitorService = {
  sendGridStats: sendGridStats,
  challengeStats: challengeStats,
  invitationStats: invitationStats,
  sendGridDeviceStats: sendGridDeviceStats,
  sendGridMailboxStats: sendGridMailboxStats,
  mailgunStats: mailgunStats,
  mailgunDeviceStats: mailgunDeviceStats,
  mailgunMailboxStats: mailgunMailboxStats,
  turingDeviceClickStats: turingDeviceClickStats,
}

/**
 * Function that gets statistics from sendGrid
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  queryParams
 * @return  json 
 */
function sendGridStats(queryParams) {
  return new Promise((resolve, reject) => {
    statsModel.getSendGridStats(queryParams).then((data) => {
      resolve({ code: code.OK, message: '', data: data.body })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that gets statistics from maingun
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  queryParams
 * @return  json 
 */
function mailgunStats(queryParams) {
  return new Promise((resolve, reject) => {
    statsModel.getMailgunStats(queryParams).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that gets statistics from sendGrid for devices
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  queryParams
 * @return  json 
 */
function sendGridDeviceStats(queryParams) {
  return new Promise((resolve, reject) => {
    statsModel.getSendGridDeviceStats(queryParams).then((data) => {
      resolve({ code: code.OK, message: '', data: data.body })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that gets statistics from sendGrid for devices
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  queryParams
 * @return  json 
 */
function turingDeviceClickStats(queryParams) {
  return new Promise((resolve, reject) => {
    statsModel.getTuringDeviceClickStats(queryParams).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that gets statistics from mailgun for devices
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  queryParams
 * @return  json 
 */
function mailgunDeviceStats() {
  return new Promise((resolve, reject) => {
    statsModel.getMailgunDeviceStats().then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that gets statistics from sendGrid for mailbox providers
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  queryParams
 * @return  json 
 */
function sendGridMailboxStats(queryParams) {
  return new Promise((resolve, reject) => {
    statsModel.getSendGridMailboxStats(queryParams).then((data) => {
      resolve({ code: code.OK, message: '', data: data.body })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that gets statistics from mailgun for mailbox providers
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  queryParams
 * @return  json 
 */
function mailgunMailboxStats() {
  return new Promise((resolve, reject) => {
    statsModel.getMailgunMailboxStats().then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that gets statistics for frontend Challenge
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  queryParams
 * @return  json 
 */
function challengeStats(queryParams) {
  return new Promise((resolve, reject) => {
    statsModel.getChallengeStats(queryParams).then((data) => {
      resolve({ code: code.OK, message: '', data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that gets for invitation email
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  queryParams
 * @return  json 
 */
function invitationStats(queryParams) {
  return new Promise((resolve, reject) => {
    statsModel.getInvitationStats(queryParams).then((data) => {
      resolve({ code: code.OK, message: '', data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}
 
module.exports = visitorService 
