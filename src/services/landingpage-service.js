/**
 * Landingpage service file
 * 
 * @package   backend/src/services
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/landingpage/
 */

var landingpageModel = require('../models/landingpage-model')
var jwt = require('jsonwebtoken')
var message = require('../constants/message')
var code = require('../constants/code')
var key = require('../config/key-config')
var timer  = require('../constants/timer')
const request = require('superagent')

var landingpageService = {
  addAgentInfo: addAgentInfo,
  addAgentData: addAgentData,
  getUserAgentDataFromIp: getUserAgentDataFromIp
}

/**
 * Function that add agent information that includes browser, iplocation, ads, etc.
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  agentInfo
 * @return  json 
 */
function addAgentInfo(agentInfo) {
  return new Promise((resolve, reject) => {
    landingpageModel.addAgentInfo(agentInfo).then((data) => {
      let uid = data.uid
      let token = jwt.sign({ uid: uid, landing: true }, key.JWT_SECRET_KEY, {
        expiresIn: timer.TOKEN_EXPIRATION
      })
      resolve({ code: code.CREATED, message: '', data: { 'token': token, 'url': data.url } })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that add agent data that includes browser, iplocation, ads, etc.
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  agentInfo
 * @return  json 
 */
function addAgentData(agentData) {
  return new Promise((resolve, reject) => {
    landingpageModel.addAgentData(agentData).then((data) => {
      let uid = data.uid
      let token = jwt.sign({ uid: uid, landing: false}, key.JWT_SECRET_KEY, {
        expiresIn: timer.TOKEN_EXPIRATION
      })
      resolve({ code: code.CREATED, message: '', data: { 'token': token } })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get user's data from 
 *
 * @author  YingTuring  <ying@turing.com>
 * @return   json
 */
function getUserAgentDataFromIp(ip) {
  const url = 'https://ip2location.turing.com/' + ip
  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set('Accept', 'application/json')
      .then((res) => {
        resolve(res)       
      })
      .catch((err) => {
        reject({ code: code.SERVICE_UNAVAILABLE, message: err.message})
      })
  })
}

module.exports = landingpageService
