/**
 * Cli router file
 * 
 * @package   backend/src/routes
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth
 */

var express = require('express')
var router = express.Router()
var cliModel = require('../models/cli-model')
var mailModel = require('../models/mail/mail-model')
var schedule = require('node-schedule')

/** 
 * Send email by 15 mins
 */
router.get('/crontab/check15mins', check15Mins)
/** 
 * Send email by 3 days
 */
router.get('/crontab/check3days', check3Days)
/** 
 * Send email by 6 days
 */
router.get('/crontab/check6days', check6Days)
/** 
 * Send email by 9 days
 */
router.get('/crontab/check9days', check9Days)

/** 
 * Send forgot pass email
 */
router.post('/send-forgot-pass', sendForgotPass)

/**
 * Function that send the email per 15 mins
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function check15Mins(req, res) {
  cliModel.check15Mins().then((result) => {
      res.json({ 'status' : 'ok' })
  })
}

/**
 * Function that send the email per 3 days
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function check3Days(req, res) {
  cliModel.check3Days().then((result) => {
      res.json({ 'status' : 'ok' })
  })
}

/**
 * Function that send the email per 6 days
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function check6Days(req, res) {
  cliModel.check6Days().then((result) => {
      res.json({ 'status' : 'ok' })
  })
}

/**
 * Function that send the email per 9 days
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function check9Days(req, res) {
  cliModel.check9Days().then((result) => {
      res.json({ 'status' : 'ok' })
  })
}

/**
 * Function that send forgot pass email
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function sendForgotPass(req, res) {
  var email = req.body.email

  cliModel.sendForgotPass(email).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that send the email per 15 mins
 *
 * @author  DongTuring <dong@turing.com>
 * @return  
 */
var scheduler15Mins = schedule.scheduleJob('0 */2 * * * *', function(){
  cliModel.check15Mins().then((result) => {
    console.log('sent emails per 1 min')
  })
})

/**
 * Function that send the email per 3 days
 *
 * @author  DongTuring <dong@turing.com>
 * @return  
 */
var scheduler3Days = schedule.scheduleJob('0 0 */3 * * *', function(){
  cliModel.check3Days().then((result) => {
    console.log('sent emails per 3 hours')
  })
})

/**
 * Function that send the email per 6 days
 *
 * @author  DongTuring <dong@turing.com>
 * @return   
 */
var scheduler6Days = schedule.scheduleJob('0 0 */6 * * *', function(){
  cliModel.check6Days().then((result) => {
    console.log('sent emails per 6 hours')
  })
})

/**
 * Function that send the email per 9 days
 *
 * @author  DongTuring <dong@turing.com>
 * @return  
 */
var scheduler9Days = schedule.scheduleJob('0 0 */9 * * *', function(){
  cliModel.check9Days().then((result) => {
    console.log('sent emails per 9 hours')
  })
})

/**
 * Function that send the email per 9 days
 *
 * @author  DongTuring <dong@turing.com>
 * @return  
 */
var schedulerFullstackSurveyEmail = schedule.scheduleJob('0 */1 * * * *', function(){
  mailModel.sendEmail().then((result) => {
    console.log('sent emails for survey link')
  })
})

scheduler15Mins.cancel()
scheduler3Days.cancel()
scheduler6Days.cancel()
scheduler9Days.cancel()
schedulerFullstackSurveyEmail.cancel()

module.exports = router
