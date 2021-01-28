/**
 * redirect router file
 * 
 * @package   backend/src/routes
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/redirect
 */

var express = require('express')
var router = express.Router()
var redirectService = require('../services/redirect-service')
var authMiddleware = require('../middleware/auth-middleware')

/** 
 * Get redirect url from token 
 */
router.get('/check-url', authMiddleware.checkToken, getRedirectUrl)

/**
 * Function that get redirect url to go uncompleted page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getRedirectUrl(req, res) {
  let userId = req.decoded.uid
  
  redirectService.getRedirectUrl(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

module.exports = router
