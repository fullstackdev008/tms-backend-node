/**
 * Landingpage router file
 * 
 * @package   backend/src/routes
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/landingpage/
 */

var express = require('express')
var router = express.Router()
var landingpageService = require('../services/landingpage-service')
var authMiddleware = require('../middleware/auth-middleware')

router.post('/add-agent-info', authMiddleware.checkTokenForSignup, addAgentInfo)
router.post('/add-agent-data', authMiddleware.checkTokenForSignup, addAgentData)

/**
 * Function that add agent information that includes browser, iplocation, ads, etc.
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function addAgentInfo(req, res) {
  let ip = req.body.ip
  let uid = req.decoded ? req.decoded.uid : 0
  let googleStatus = req.body.googleStatus ? 'true' : 'false'
  let facebookStatus = req.body.facebookStatus ? 'true' : 'false'
  // Get IP & Location
  landingpageService.getUserAgentDataFromIp(ip).then((result) => {
    let agentInfo = {
      profession: req.body.profession,
      referrerUrl: req.body.referrerUrl,
      browserName: req.body.browserName,
      browserVersion: req.body.browserVersion,
      os: req.body.os,
      screenWidth: req.body.screenWidth,
      screenHeight: req.body.screenHeight,
      adsSite: req.body.adsSite,
      campaignNum: req.body.campaignNum,
      ip: req.body.ip,
      country: result.body.country_name,
      region: result.body.region_name,
      city: result.body.city_name,
      quizAnswer: req.body.quizAnswer,
      uid: uid,
      googleStatus: googleStatus,
      facebookStatus: facebookStatus
    }
  
    landingpageService.addAgentInfo(agentInfo).then((result) => {
      res.json(result)
    }).catch((err) => {
      res.json(err)
    })
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that add agent information that includes browser, iplocation, ads, etc.
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function addAgentData(req, res) {
  let ip = req.body.ip
  let uid = req.decoded ? req.decoded.uid : 0
  let googleStatus = req.body.googleStatus ? 'true' : 'false'
  let facebookStatus = req.body.facebookStatus ? 'true' : 'false'
  // Get IP & Location
  landingpageService.getUserAgentDataFromIp(ip).then((result) => {  
    let agentData = {
      profession: '',
      referrerUrl: req.body.referrerUrl,
      browserName: req.body.browserName,
      browserVersion: req.body.browserVersion,
      os: req.body.os,
      screenWidth: req.body.screenWidth,
      screenHeight: req.body.screenHeight,
      adsSite: req.body.adsSite,
      campaignNum: req.body.campaignNum,
      ip: ip,
      country: result.body.country_name,
      region: result.body.region_name,
      city: result.body.city_name,
      uid: uid,
      googleStatus: googleStatus,
      facebookStatus: facebookStatus,
      quizAnswer: ''
    }
  
    landingpageService.addAgentData(agentData).then((result) => {
      res.json(result)
    }).catch((err) => {
      res.json(err)
    })
  }).catch((err) => {
    res.json(err)
  })
}

module.exports = router
