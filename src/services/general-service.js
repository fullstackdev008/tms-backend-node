/**
 * General service file
 * 
 * @package   backend/src/services
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/general/
 */

var generalModel = require('../models/general-model')
var message = require('../constants/message')
var code = require('../constants/code')

var generalService = {
  getContactList: getContactList,
  getVisitHistory: getVisitHistory,
  getChallengeList: getChallengeList,
  getChallengeLogList: getChallengeLogList,
  getChallengeTopErrors: getChallengeTopErrors
}

/**
 * Function that get contact list
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  json 
 */
function getContactList(data) {
  return new Promise((resolve, reject) => {
    generalModel.getContactList(data).then((res) => {
      resolve({ code: code.OK, message: '', data: res })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get visit history
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  json 
 */
function getVisitHistory(data) {
  return new Promise((resolve, reject) => {
    generalModel.getVisitHistory(data).then((res) => {
      resolve({ code: code.OK, message: '', data: res })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get challenge list
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  json 
 */
function getChallengeList(data) {
  return new Promise((resolve, reject) => {
    generalModel.getChallengeList(data).then((res) => {
      resolve({ code: code.OK, message: '', data: res })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get challenge log list
 *
 * @author  YingTuring <ying@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  json 
 */
function getChallengeLogList(data) {
  return new Promise((resolve, reject) => {
    generalModel.getChallengeLogList(data).then((res) => {
      resolve({ code: code.OK, message: '', data: res })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get challenge top errors
 *
 * @author  YingTuring <ying@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  json 
 */
function getChallengeTopErrors(data) {
  return new Promise((resolve, reject) => {
    generalModel.getChallengeTopErrors(data).then((res) => {
      resolve({ code: code.OK, message: '', data: res })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

module.exports = generalService
