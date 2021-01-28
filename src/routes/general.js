/**
 * General router file
 * 
 * This apis are general functions that doesn't need auth token
 * 
 * @package   backend/src/routes
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/general/
 */

const express = require('express')
const router = express.Router()
var generalService = require('../services/general-service')
var authMiddleware = require('../middleware/auth-middleware')

router.use(authMiddleware.checkAdminToken)

router.get('/get-contact-list', getContactList)
router.get('/get-visit-history', getVisitHistory)
router.get('/get-challenge-list', getChallengeList)
router.get('/get-challenge-log-list', getChallengeLogList)
router.get('/get-challenge-top-errors', getChallengeTopErrors)

/**
 * Function that get contact list
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getContactList(req, res) {
  let data = {
    page: req.query.page,
    rowsPerPage: req.query.rowsPerPage,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    emailAddress: req.query.emailAddress,
    linkedinAccount: req.query.linkedinAccount,
    googleAccount: req.query.googleAccount,
    facebookAccount: req.query.facebookAccount,
    githubAccount: req.query.githubAccount,
    resumeFile: req.query.resumeFile,
    referrerUrl: req.query.referrerUrl,
    profession: req.query.profession,
    webBrowser: req.query.webBrowser,
    deviceType: req.query.deviceType,
    testLanguage: req.query.testLanguage,
    testUserScorePalindrome: req.query.testUserScorePalindrome,
    testSystemScorePalindrome: req.query.testSystemScorePalindrome,
    testUserScoreHackland: req.query.testUserScoreHackland,
    testSystemScoreHackland: req.query.testSystemScoreHackland,
    quizAnswer: req.query.quizAnswer,
    adsSite: req.query.adsSite,
    campaignName: req.query.campaignName,
    searchParam: req.query.searchParam,
    searchValue: req.query.searchValue
  }

  generalService.getContactList(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get visit history
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getVisitHistory(req, res) {
  let data = {
    page: req.query.page,
    rowsPerPage: req.query.rowsPerPage,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    emailAddress: req.query.emailAddress,
    linkedinAccount: req.query.linkedinAccount,
    googleAccount: req.query.googleAccount,
    facebookAccount: req.query.facebookAccount,
    githubAccount: req.query.githubAccount,
    resumeFile: req.query.resumeFile,
    referrerUrl: req.query.referrerUrl,
    profession: req.query.profession,
    webBrowser: req.query.webBrowser,
    deviceType: req.query.deviceType,
    testLanguage: req.query.testLanguage,
    testUserScorePalindrome: req.query.testUserScorePalindrome,
    testSystemScorePalindrome: req.query.testSystemScorePalindrome,
    testUserScoreHackland: req.query.testUserScoreHackland,
    testSystemScoreHackland: req.query.testSystemScoreHackland,
    quizAnswer: req.query.quizAnswer,
    adsSite: req.query.adsSite,
    campaignName: req.query.campaignName,
    searchParam: req.query.searchParam,
    searchValue: req.query.searchValue
  }

  generalService.getVisitHistory(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get challenge list
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getChallengeList(req, res) {
  let data = {
    page: req.query.page,
    rowsPerPage: req.query.rowsPerPage,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    sendDate: req.query.sendDate,
    sourceCode: req.query.sourceCode,
    hostLink: req.query.hostLink,
    searchParam: req.query.searchParam,
    searchValue: req.query.searchValue,
  }

  generalService.getChallengeList(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get challenge log list
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getChallengeLogList(req, res) {
  let data = {
    page: req.query.page,
    rowsPerPage: req.query.rowsPerPage,
    stackTrace: req.query.stackTrace,
    errorMessage: req.query.errorMessage
  }

  generalService.getChallengeLogList(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get challenge top errors
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getChallengeTopErrors(req, res) {
  let data = {
    page: req.query.page,
    rowsPerPage: req.query.rowsPerPage,
  }

  generalService.getChallengeTopErrors(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

module.exports = router
