/**
 * stats model file
 *
 * @package   backend/src/models/mail
 * @author    Zecharias <zecharias.a@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var table = require('../constants/table')
var message  = require('../constants/message')

const client = require("@sendgrid/client");
const mailConfig = require("../config/mail-config");
var mailgun = require('mailgun.js');
var mg = mailgun.client({username: 'api', key: mailConfig.MAILGUN.privateApiKey, public_key: mailConfig.MAILGUN.publicApiKey});
var mailGunJS = require('mailgun-js')({apiKey: mailConfig.MAILGUN.privateApiKey}); 

client.setApiKey(mailConfig.SENDGRID.apiKey);
const request = {
  method: "GET",
  url: "/v3/api_keys"
};

client.setDefaultRequest("baseUrl", mailConfig.SENDGRID.baseUrl);

var table = require('../constants/table')
var db = require('../database/database')

var statsModel = {
  getSendGridStats: getSendGridStats,
  getChallengeStats: getChallengeStats,
  getInvitationStats: getInvitationStats,
  getSendGridDeviceStats: getSendGridDeviceStats,
  getSendGridMailboxStats: getSendGridMailboxStats,
  getMailgunStats: getMailgunStats,
  getMailgunDeviceStats: getMailgunDeviceStats,
  getMailgunMailboxStats: getMailgunMailboxStats,
  getTuringDeviceClickStats: getTuringDeviceClickStats
}

/**
 * Function that gets statistics from sendGrid 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object queryParams
 * @return  object if success returns object else returns message.
 */
function getSendGridStats(queryParams) {
  request.qs = queryParams;
  request.method = 'GET';
  request.url = '/v3/stats';
  return new Promise((resolve, reject) => {
    client.request(request)
      .then(([response, body]) => {
        resolve(response);
      }).catch(err => {
        resolve(false);
      });
  });
}

/**
 * Function that gets statistics from mailgun 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object queryParams
 * @return  object if success returns object else returns message.
 */
function getMailgunStats(queryParams) {
  let domain = mailConfig.MAILGUN.domain
  return new Promise((resolve, reject) => {
    mg.stats.getDomain(domain, {event: ['accepted', 'delivered', 'failed', 'opened'], start: queryParams.start, end: queryParams.end, resolution: queryParams.resolution})
      .then(response => resolve(response)) 
      .catch(err => resolve(false))
  }); 
}

/**
 * Function that gets statistics from sendGrid for devices
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object queryParams
 * @return  object if success returns object else returns message.
 */
function getSendGridDeviceStats(queryParams) {
  request.qs = queryParams;
  request.method = 'GET';
  request.url = '/v3/devices/stats';
  return new Promise((resolve, reject) => {
    client.request(request)
      .then(([response, body]) => {
        resolve(response);
      }).catch(err => {
        resolve(false);
      });
  });
}

/**
 * Function that gets statistics from mailgun for devices
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object queryParams
 * @return  object if success returns object else returns message.
 */
function getMailgunDeviceStats() {
  return new Promise((resolve, reject) => {
    mailGunJS.get('/'+mailConfig.MAILGUN.domain+'/tags/' + mailConfig.MAILGUN.developerTag + '/stats/aggregates/devices', function (error, body) {
      if (error) {
        resolve(false)
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * Function that gets statistics from sendGrid for devices
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object queryParams
 * @return  object if success returns object else returns message.
 */
function getSendGridMailboxStats(queryParams) {
  request.qs = queryParams;
  request.method = 'GET';
  request.url = '/v3/mailbox_providers/stats';
  return new Promise((resolve, reject) => {
    client.request(request)
      .then(([response, body]) => {
        resolve(response);
      }).catch(err => {
        resolve(false);
      });
  });
}

/**
 * Function that gets statistics from sendGrid for devices
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object queryParams
 * @return  object if success returns object else returns message.
 */
function getMailgunMailboxStats() {
  return new Promise((resolve, reject) => {
    mailGunJS.get('/'+mailConfig.MAILGUN.domain+'/tags/' + mailConfig.MAILGUN.developerTag + '/stats/aggregates/providers', function (error, body) {
      if (error) {
        resolve(false)
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * Function that gets statistics for  challenge
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object queryParams
 * @return  object if success returns object else returns message.
 */
function getChallengeStats(queryParams) {
  stats = {}
  return new Promise((resolve, reject) => {
    let visitQuery = 'SELECT count(*) as unique_visits, SUM(visit_count) as total_visits FROM ' + table.CHALLENGE_VISITOR + ' WHERE created_date > ? AND updated_date < ? AND challenge_type_id = ?'
    db.query(visitQuery, [queryParams.start_date, queryParams.end_date, queryParams.challenge_type_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows[0])
      }
    })
  })
  
}

/**
 * Function that gets statistics for Invitation Email
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object queryParams
 * @return  object if success returns object else returns message.
 */
function getInvitationStats(queryParams) {
  stats = {}
  return new Promise((resolve, reject) => {
    let visitQuery = 'SELECT SUM(CASE WHEN response=1 THEN 1 ELSE 0 end) AS yes_count, SUM(CASE WHEN response=0 THEN 1 ELSE 0 END) AS no_count, COUNT(*) AS people_requested, SUM(visit_count) AS total_visits FROM ' + table.HOMEPAGE_VISITOR + ' WHERE created_date > ? AND updated_date < ? '
    db.query(visitQuery, [queryParams.start_date, queryParams.end_date], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows[0])
      }
    })
  })
}

/**
 * Function that gets statistics for Invitation Email
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object queryParams
 * @return  object if success returns object else returns message.
 */
function getTuringDeviceClickStats(queryParams) {
  return new Promise((resolve, reject) => {
    let uniqueClickQuery = 'SELECT COUNT(DISTINCT email) as unique_clicks FROM ' + table.EMAIL_CLICK + ' WHERE created_date > ? AND created_date < ? AND device = ?'
    let totalClickQuery = 'SELECT COALESCE(SUM(click_count), 0) as total_clicks FROM ' + table.EMAIL_CLICK + ' WHERE created_date > ? AND created_date < ? AND device = ?'
    let queries = uniqueClickQuery + '; ' + totalClickQuery
    let inDuration = true
    let start = queryParams.start_date
    let stopAt = calculateNextDate(new Date(queryParams.start_date), queryParams.aggregated_by)
    let durations = []
    while (true) {
      if (inDuration) {
        durations.push({
          start: start,
          stop: stopAt
        })
      } else {
        if (new Date(queryParams.end_date) > new Date(start)) {
          durations.push({
            start: start,
            stop: queryParams.end_date
          })
        }
        break
      }
      start = stopAt
      stopAt = calculateNextDate(new Date(stopAt), queryParams.aggregated_by)
      if (new Date(stopAt) >= new Date(queryParams.end_date)) {
        inDuration = false
      }
    }

    function job(device) {
      return new Promise(function (resolve, reject) {
        let stat = []
        let counter = 0;
        durations.forEach(function(duration, i) {
          db.query(queries, [duration.start, duration.stop, device, duration.start, duration.stop, device], (error, rows, fields) => {
            if (error) {
              reject(false);
            } else {
              counter++;
              let obj = {
                date: duration.start,
                unique_clicks: rows[0][0].unique_clicks,
                total_clicks: rows[1][0].total_clicks
              }
              stat[i] = obj
              if (counter === durations.length) {
                let obj = {}
                obj[device] = stat
                resolve(obj)
              }
            }
          })
        });
      });
    }

    var promise = Promise.all([job('desktop'), job('tablet'), job('mobile')]);

    promise.then(function (data) {
      resolve(data)
    })
  })
}

function calculateNextDate (date, aggregatedBy) {
  let offsetDays = 0
  if (aggregatedBy === 'day') {
    offsetDays = 1
  } else if (aggregatedBy === 'week') {
    offsetDays = 7
  } else {
    offsetDays = 30
  }
  let dateOffset = 24 * 60 * 60 * 1000 * offsetDays
  date.setTime(date.getTime() + dateOffset)
  let day = date.getDate()
  if (day < 10) {
    day = "0" + day
  }
  let month = date.getMonth() + 1 //As January is 0.

  if (month < 10) {
    month = "0" + month
  }
  let year = date.getFullYear()
  return (year + '-' + month + '-' + day)
}


module.exports = statsModel
