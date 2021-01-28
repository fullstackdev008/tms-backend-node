/**
 * Landingpage service file
 * 
 * @package   backend/src/services
 * @author    Zecharias <zecharias.a@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/landingpage/
 */

var challengeVisitorModel = require('../models/challenge-visitor-model')
var homepageVisitorModel = require('../models/homepage-visitor-model')
var mailModel = require('../models/mail/mail-model')
var analyticsModel = require('../models/analytics-model')
var message = require('../constants/message')
var code = require('../constants/code')
var path = require('../constants/path')

var visitorService = {
  saveVisit: saveVisit,
  saveInvitationResponse: saveInvitationResponse,
  sendInvitaionEmail: sendInvitaionEmail,
  saveClickAnalytics: saveClickAnalytics
}

/**
 * Function that saves visit information
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  visitInfo
 * @return  json 
 */
function saveVisit(visitInfo) {
  return new Promise((resolve, reject) => {
    challengeVisitorModel.saveVisit(visitInfo).then((data) => {
      resolve({ code: code.CREATED, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves click analytics
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  visitInfo
 * @return  json 
 */
function saveClickAnalytics(clickInfo) {
  return new Promise((resolve, reject) => {
    analyticsModel.saveClickAnalytics(clickInfo).then((data) => {
      resolve({ code: code.CREATED, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}


/**
 * Function that saves response made to invitation
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  visitInfo
 * @return  json 
 */
function saveInvitationResponse(visitInfo) {
  return new Promise((resolve, reject) => {
    homepageVisitorModel.saveResponse(visitInfo).then((data) => {
      resolve({ code: code.CREATED, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that sends ivitation email
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  visitorDetails
 * @return  json 
 */
function sendInvitaionEmail(visitorDetails) {
  return new Promise((resolve, reject) => {
    mailModel.sendInvitationEmail(visitorDetails).then((data) => {
      homepageVisitorModel.saveEmailRequest(visitorDetails)
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

function getInvitaionTemplate() {
  return '<!DOCTYPE html>'
    +'<html>'
        +'<body>'
            +'<table style="font-family: sans-serif; text-align: center; width: 40%; margin-left: auto; margin-right: auto;">'
               +' <tr>'
                   +'<td colspan="2">'
                        +'<h2 style="font-weight: normal; font-size: 3em; color: #222222;">Turing</h2>'
                    +'</td>'
                +'</tr>'
                +'<tr>'
                    +'<td colspan="2">'
                        +'Interested in American software engineering jobs?'
                    +'</td>'
                +'</tr>'
                +'<tr>'
                    +'<td style="width:50%; padding-top: 40px;">'
                        +'<a href="'+path.BASE_URL+'?em=-email-&resp=-yes-" style=" font: bold 20px Arial; text-decoration: none; background-color: #333333; color: #eeeeee; padding: 10px 40px 10px 40px; border: 1px solid #888888; border-radius: 7px; margin-right: 28px;">Yes</a>'
                    +'</td>'
                    +'<td style="width:50%; padding-top: 40px;">'
                        +'<a href="'+path.BASE_URL+'?em=-email-&resp=-no-" style=" font: bold 20px Arial; text-decoration: none; background-color: #cccccc; color: #999999; padding: 10px 40px 10px 40px; border: 1px solid #dddddd; border-radius: 7px; margin-left: 28px;">No</a>'
                    +'</td>'
                +'</tr>'
                +'<tr>'
                    +'<td colspan="2" style="padding-top: 80px;">'
                        +'<a style="font-size: 0.8em;" href="'+path.BASE_URL+'unsubscribe/-cryptEmail-">Click here to unsubscribe from Turing jobs emails</a>'
                    +'</td>'
                +'</tr>'
                +'<tr>'
                    +'<td colspan="2" style="padding-top: 90px;">'
                        +'<span style="font-size: 0.8em; color: #999999;"> 1900 Embarcadero Rd, Suite 104, Palo Alto, California, 94303, USA  </span>'
                    +'</td>'
                +'</tr>'
            +'</table>'
        +'</body>'
    +'</html>';
}
 
module.exports = visitorService 
