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
var statsService = require('../services/stats-service')
var authMiddleware = require('../middleware/auth-middleware')

router.use(authMiddleware.checkAdminToken)

/** 
 * Get user id from token 
 */
router.get('/sendgrid', getSendGridStats);
router.get('/mailgun', getMailgunStats);
router.get('/challenge', getChallengeStats);
router.get('/invitationEmail', getInvitationStats);
router.get('/sendGridDevices', getSendGridDeviceStats);
router.get('/turingDevices', getTuringDeviceClickStats);
router.get('/sendGridMailboxProvider', getSendGridMailboxStats);
router.get('/sendGridAllMailboxProviders', getAllMailboxStats);
router.get('/mailgunDevices', getMailgunDeviceStats);
router.get('/mailgunMailboxProvider', getMailgunMailboxStats);

/**
 * Function that gets sendgrid stats by device
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getSendGridDeviceStats(req, res) {
  let { aggregated_by, start_date, end_date } = req.query;
  if (!aggregated_by) {
    aggregated_by = 'day'
  }
  const queryParams = {
    'aggregated_by': aggregated_by,
    'limit': 999,
    'start_date': start_date,
    'end_date': end_date
  }

  statsService.sendGridDeviceStats(queryParams).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets click stats from Turing
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getTuringDeviceClickStats(req, res) {
  let { aggregated_by, start_date, end_date } = req.query;
  if (!aggregated_by) {
    aggregated_by = 'day'
  }
  const queryParams = {
    'aggregated_by': aggregated_by,
    'limit': 999,
    'start_date': start_date,
    'end_date': end_date + ' 23:59:59'
  }

  statsService.turingDeviceClickStats(queryParams).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets Mailgun stats by device
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getMailgunDeviceStats(req, res) {
  statsService.mailgunDeviceStats().then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets Mailgun stats by device
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getMailgunDeviceStats(req, res) {
  statsService.mailgunDeviceStats().then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets sendgrid stats by mailbox provider
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getSendGridMailboxStats(req, res) {
  let { aggregated_by, start_date, end_date, mailbox_provider } = req.query;
  if (!aggregated_by) {
    aggregated_by = 'day'
  }
  const queryParams = {
    'aggregated_by': aggregated_by,
    'limit': 10,
    'start_date': start_date,
    'end_date': end_date,
    'mailbox_providers': mailbox_provider
  }

  statsService.sendGridMailboxStats(queryParams).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets Mailgun stats by mailbox provider
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getMailgunMailboxStats(req, res) {
  statsService.mailgunMailboxStats().then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets sendgrid stats for all Mailbox Providers
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getAllMailboxStats(req, res) {
  let { aggregated_by, start_date, end_date } = req.query;
  if (!aggregated_by) {
    aggregated_by = 'day'
  }
  const queryParams = {
    'aggregated_by': aggregated_by,
    'limit': 10,
    'start_date': start_date,
    'end_date': end_date
  }

  statsService.sendGridMailboxStats(queryParams).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets sendgrid stats
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getSendGridStats(req, res) {
  let { aggregated_by, start_date, end_date } = req.query
  if (!aggregated_by) {
    aggregated_by = 'day'
  }
  const queryParams = {
    'aggregated_by': aggregated_by, 
    'limit': 999, 
    'offset': 0, 
    'start_date': start_date,
    'end_date': end_date
  }

  statsService.sendGridStats(queryParams).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets mailgun stats
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getMailgunStats(req, res) {
  let { resolution, start, end } = req.query
  if (!resolution) {
    resolution = 'day'
  }
  const queryParams = {
    resolution: resolution, 
    start: start, 
    end: end
  }

  statsService.mailgunStats(queryParams).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets frontend challenge stats
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getChallengeStats(req, res) {
  let { start_date, end_date, challenge_type_id } = req.query

  let endDate = new Date(end_date)
  let dateOffset = (24*60*60*1000) 
  endDate.setTime(endDate.getTime() + dateOffset)

  let endDay = endDate.getDate()
  let endMonth = endDate.getMonth()+1 //As January is 0.
  let endYear = endDate.getFullYear()
  end_date = endYear + '-' + endMonth + '-' + endDay

  const queryParams = {
    start_date: start_date,
    end_date: end_date, 
    challenge_type_id: challenge_type_id
  }
  statsService.challengeStats(queryParams).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that gets landing page stats
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json
 */

function getInvitationStats(req, res) {
  let { start_date, end_date } = req.query

  let endDate = new Date(end_date)
  let dateOffset = (24*60*60*1000) 
  endDate.setTime(endDate.getTime() + dateOffset)

  let endDay = endDate.getDate()
  let endMonth = endDate.getMonth()+1 //As January is 0.
  let endYear = endDate.getFullYear()
  end_date = endYear + '-' + endMonth + '-' + endDay

  const queryParams = {
    start_date: start_date,
    end_date: end_date
  }
  statsService.invitationStats(queryParams).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

 
module.exports = router
