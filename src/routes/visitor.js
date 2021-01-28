/**
 * Landingpage router file
 * 
 * @package   backend/src/routes
 * @author    Zecharias <zecharias.a@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/landingpage/
 */

var express = require('express')
var router = express.Router()
var visitorService = require('../services/visitor-service')
var landingpageService = require('../services/landingpage-service')


router.post('/saveVisitorInfo', saveVisitorInfo)
router.post("/saveInvitationResponse", saveInvitationResponse)
router.post("/sendInvitaionEmail", sendInvitaionEmail)
router.post("/saveClickAnalytics", saveClickAnalytics)

/**
 * Function that saves a visit to front end challenge
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function saveVisitorInfo(req, res) {
  var { email, client, challengeTypeId } = req.body

  let visitInfo = {
    email: email,
    client: client,
    challengeTypeId: challengeTypeId
  }

  visitorService.saveVisit(visitInfo).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves a visit to front end challenge
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */

function saveClickAnalytics(req, res) {
  var { email, link, device, osName, osVersion, vendor, model, screenWidth, screenHeight, ip } = req.body
  // Get IP & Location
  landingpageService.getUserAgentDataFromIp(ip).then((result) => {
    let clickInfo = {
      email: email,
      link: link,
      device: device,
      osName: osName,
      osVersion: osVersion,
      vendor: vendor,
      model: model,
      screenWidth: screenWidth,
      screenHeight: screenHeight,
      ip: ip,
      country: result.body.country_name,
      region: result.body.region_name,
      city: result.body.city_name
    }
    visitorService.saveClickAnalytics(clickInfo).then((result) => {
      res.json(result)
    }).catch((err) => {
      res.json(err)
    })
  }).catch((err) => {
    res.json(err)
  })
}


/**
 * Function that saves a visit to front end challenge
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function saveInvitationResponse(req, res) {
  var { email, response } = req.body

  let visitInfo = {
    email: email,
    response: response === "yes" ? "1" : "0"
  }
  visitorService.saveInvitationResponse(visitInfo).then(result => {
    res.json(result)
  }).catch(err => {
    res.json(err)
  })
}

/**
 * Function that sends invitation email
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function sendInvitaionEmail(req, res) {
  var { email, first_name } = req.body

  if (!first_name) {
    first_name = ''
  }

  let visitorDetails = {
    email: email,
    first_name: first_name
  }

  if (email) {
    visitorService.sendInvitaionEmail(visitorDetails).then(result => {
      res.json(result)
    }).catch(err => {
      res.json(err)
    })
  }
}

 
module.exports = router
