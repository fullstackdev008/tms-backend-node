/**
 * Code test service file
 * 
 * @package   backend/src/services
 * @author    YingTuring <ying@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/board/
 */

var testModel = require('../models/test-model')
var message = require('../constants/message')
var code = require('../constants/code')

var codeTestService = {
  saveTestResult: saveTestResult,
  saveTestResponseTime:saveTestResponseTime,
  saveJavaScriptTestType: saveJavaScriptTestType,
  saveSelectedLanguage: saveSelectedLanguage
}

/**
 * Function that save user's test result data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object testData
 * @return  json 
 */
function saveTestResult(testData) {
  return new Promise((resolve, reject) => {
    testModel.saveTestResult(testData).then((data) => {
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
 * Function that save user's test result data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object data
 * @return  json 
 */
function saveTestResponseTime(data) {
  return new Promise((resolve, reject) => {
    testModel.saveTestResponseTime(data).then((data) => {
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
 * Function that save JavaScript test type
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object data
 * @return  json 
 */
function saveJavaScriptTestType(data) {
  return new Promise((resolve, reject) => {
    testModel.saveJavaScriptTestType(data).then((data) => {
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
 * Function that save user's selected language
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object languageData
 * @return  json 
 */
function saveSelectedLanguage(languageData) {
  return new Promise((resolve, reject) => {
    testModel.saveSelectedLanguage(languageData).then((data) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

module.exports = codeTestService
