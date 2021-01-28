/**
 * Test board model file
 *
 * @package   backend/src/models
 * @author    YingTuring <ying@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/board/
 */

var db = require('../database/database')
var message  = require('../constants/message')
var visitModel = require('./visit-model')
var table  = require('../constants/table')

var testBoardModel = {
  saveTestResult: saveTestResult,
  saveTestResponseTime: saveTestResponseTime,
  saveJavaScriptTestType: saveJavaScriptTestType,
  saveSelectedLanguage: saveSelectedLanguage
}

/**
 * Function that save user's test data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object testData
 * @return  object if success returns object else returns message
 */
function saveTestResult(testData) {
  var strRoot = testData.from

  if (strRoot == 'flow') {
    let testDate = new Date()
    var query = 'UPDATE ' + table.SUBMIT_LIST + ' SET  test_user_score_palindrome = ?, test_system_score_palindrome = ?, test_time_palindrome = ?, test_date_palindrome = ?, test_source_path_palindrome = ? WHERE uid = ?'

    if (testData.test_type == 'Hackland')
      query = 'UPDATE ' + table.SUBMIT_LIST + ' SET  test_user_score_hackland = ?, test_system_score_hackland = ?, test_time_hackland = ?, test_date_hackland = ?, test_source_path_hackland = ? WHERE uid = ?'

    return new Promise((resolve, reject) => {
      db.query(query, [testData.test_user_score, testData.test_system_score, testData.test_time, testDate, testData.test_source, testData.userId], (error, result, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          visitModel.checkVisitSession(db, testData.userId, 0).then((result) =>{
            resolve()
          })
        }
      })
    })
  } else {
    var query = 'UPDATE ' + table.TEST_LIST + ' SET  test_user_score_palindrome = ?, test_system_score_palindrome = ?, test_time_palindrome = ?, test_source_palindrome = ? WHERE uid = ? AND test_language = ?'

    if (testData.test_type == 'Hackland')
      query = 'UPDATE ' + table.TEST_LIST + ' SET  test_user_score_hackland = ?, test_system_score_hackland = ?, test_time_hackland = ?, test_source_hackland = ? WHERE uid = ? AND test_language = ?'
    else if (testData.test_type == 'ListMax')
      query = 'UPDATE listmax_test_list_v4 SET  test_user_score = ?, test_system_score = ?, test_time = ?, test_source = ? WHERE uid = ? AND test_language = ?'

    return new Promise((resolve, reject) => {
      db.query(query, [testData.test_user_score, testData.test_system_score, testData.test_time, testData.test_source, testData.userId, testData.language], (error, result, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve()
        }
      })
    })
  }    
}

/**
 * Function that save test response time
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object data
 * @return  object if success returns object else returns message
 */
function saveTestResponseTime(data) {
  var query = `INSERT INTO ${table.TEST_LOG} set ?`

  return new Promise((resolve, reject) => {
    db.query(query, data, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that save user's JavaScript test type
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object data
 * @return  object if success returns object else returns message
 */
function saveJavaScriptTestType(data) {
  var query = 'UPDATE ' + table.SUBMIT_LIST + ' SET javascript_test_type = ? WHERE uid = ?'

  return new Promise((resolve, reject) => {
    db.query(query, [data.type, data.userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, data.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that save user's selected language
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object languageData
 * @return  object if success returns object else returns message
 */
function saveSelectedLanguage(languageData) {
  var strRoot = languageData.from

  if (strRoot == 'flow') {
    var query = 'UPDATE ' + table.SUBMIT_LIST + ' SET test_language = ?, javascript_test_type = 2 WHERE uid = ?'

    return new Promise((resolve, reject) => {
      db.query(query, [languageData.testName, languageData.userId], (error, result, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          visitModel.checkVisitSession(db, languageData.userId, 0).then((result) =>{
            resolve()
          })
        }
      })
    })
  } else {    
    var query = 'INSERT INTO ' + table.TEST_LIST + '(uid, test_language) VALUES (?, ?)'

    if (strRoot == 'listmax')
      query = 'INSERT INTO listmax_test_list_v4 (uid, test_language) VALUES (?, ?)'

    return new Promise((resolve, reject) => {
      db.query(query, [languageData.userId, languageData.testName], (error, result, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve()
        }
      })
    })
  }    
}

module.exports = testBoardModel
