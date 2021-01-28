/**
 * analytics model file
 *
 * @package   backend/src/models/mail
 * @author    Zecharias <zecharias.a@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var table = require('../constants/table')
var db = require('../database/database')
var message = require('../constants/message')

var AnalyticsModel = {
  saveClickAnalytics: saveClickAnalytics
}

/**
 * Function that send email templete. 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object data
 * @return  object if success returns object else returns message.
 */
function saveClickAnalytics(data) {
  return new Promise((resolve, reject) => {
    let currentTime = new Date();
    let day = currentTime.getDate()
    if (day < 10) {
      day = "0" + day
    }
    let month = currentTime.getMonth() + 1 //As January is 0.
    if (month < 10) {
      month = "0" + month
    }
    let year = currentTime.getFullYear()
    let today = year + "-" + month + "-" + day
    const query = 'SELECT id, click_count FROM '+table.EMAIL_CLICK+' WHERE email = ? AND link = ? AND device = ? AND ip = ? AND created_date > ?';
    db.query(query, [data.email, data.link, data.device, data.ip, today], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if(rows.length > 0){
          let updateQuery = 'UPDATE ' + table.EMAIL_CLICK + ' SET click_count = click_count + 1 WHERE id = ?';
          db.query(updateQuery, [rows[0].id], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }else{
          let saveQuery = 'INSERT INTO ' + table.EMAIL_CLICK + '(email, link, device, vendor, model, osName, osVersion, screenWidth, screenHeight, ip, country, region, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          db.query(saveQuery, [data.email, data.link, data.device, data.vendor, data.model, data.osName, data.osVersion, data.screenWidth, data.screenHeight, data.ip, data.country, data.region, data.city], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }
      }
    });
  })    
}

module.exports = AnalyticsModel
