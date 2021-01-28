/**
 * Test board router file
 *
 * @package   backend/src/routes
 * @author    YingTuring <ying@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/submit/test_board
 */

const express = require('express')
const router = express.Router()
const fs = require('fs')
var PathConstant = require('../constants/path'), UploadPath = PathConstant.UploadPath
var authMiddleware = require('../middleware/auth-middleware')
var testService = require('../services/test-service')

/** 
 * Get user id from token 
 */
router.use(authMiddleware.checkToken)

/** 
 * Save test result API
 */
router.post('/save-test-result', saveTestResult)

/** 
 * Save test response time API
 */
router.post('/save-test-response-time', saveTestResponseTime)

/** 
 * Save JavaScript test type API
 */
router.post('/save-javascript-test-type', saveJavaScriptTestType)

/** 
 * Save selected language API
 */
router.post('/save-selected-language', saveSelectedLanguage)

/**
 * Function that save test result
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveTestResult(req, res) {
  var userId = req.decoded.uid
  var today = Date.now()
  var language = req.body.testResult.language
  var source = req.body.testResult.code
  var targetDir = UploadPath.UPLOADORIGIN

  if (!fs.existsSync(targetDir))
    fs.mkdirSync(targetDir)

  targetDir = UploadPath.SOURCECODE

  if (!fs.existsSync(targetDir))
    fs.mkdirSync(targetDir)

  var targetFileName = today + "_source"

  if (language == 'Objective-C')
    targetFileName = targetFileName + '.m'
  else if (language == 'JavaScript')
    targetFileName = targetFileName + '.js'
  else if (language == 'Java')
    targetFileName = targetFileName + '.java'
  else if (language == 'Python')
    targetFileName = targetFileName + '.py'
  else if (language == 'Swift')
    targetFileName = targetFileName + '.swift'
  else if (language == 'Ruby')
    targetFileName = targetFileName + '.rb'
  else if (language == 'Scala')
    targetFileName = targetFileName + '.scala'
  else if (language == 'PHP')
    targetFileName = targetFileName + '.php'
  else if (language == 'C++')
    targetFileName = targetFileName + '.cpp'
  else if (language == 'C')
    targetFileName = targetFileName + '.c'

  var targetFilepath = targetDir + targetFileName

  fs.writeFile(targetFilepath, source, 'utf8', function (error) {
    if (error) throw error
  })

  var testData = {
    userId: userId,
    from: req.body.from,
    language: language,
    test_user_score: req.body.testResult.score,
    test_system_score: req.body.testResult.systemScore,
    test_time: req.body.testResult.time,
    test_source: targetFileName,
    test_type : req.body.testResult.testType
  }

  testService.saveTestResult(testData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save test result
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveTestResponseTime(req, res) {
  var userId = req.decoded.uid
 
  var data = {
    uid: userId,
    test_name: req.body.testName,
    test_language: req.body.testLanguage,
    response_time: req.body.reponseTime,
    status: req.body.status
  }

  testService.saveTestResponseTime(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save JavaScript test type
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveJavaScriptTestType(req, res) {
  var data = {
    userId: req.decoded.uid,
    type: req.body.type
  }
  
  testService.saveJavaScriptTestType(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save selected language
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveSelectedLanguage(req, res) {
  var userId = req.decoded.uid
  var from = req.body.from
  var testName = req.body.testName

  var languageData = {
    userId: userId,
    from: from,
    testName: testName,
  }

  testService.saveSelectedLanguage(languageData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

module.exports = router
