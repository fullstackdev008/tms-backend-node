/**
 * Redirect service file
 * 
 * @package   backend/src/services
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth/
 */

var redirectModel = require('../models/redirect-model')
var message = require('../constants/message')
var code = require('../constants/code')

var redirectService = {
  getRedirectUrl: getRedirectUrl
}

/**
 * Function that get redirect url to go uncompleted page
 *
 * @author  DongTuring <dong@turing.com>
 * @return  string 
 */
function getRedirectUrl(userId) {
  return new Promise((resolve, reject) => {
    redirectModel.checkUncompletedPage(userId).then((pageUrl) => {
      resolve({ code: code.OK, message: '', data: { 'url': pageUrl } })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      els
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

module.exports = redirectService
