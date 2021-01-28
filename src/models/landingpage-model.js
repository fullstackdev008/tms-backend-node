/**
 * Landingpage model file
 *
 * @package   backend/src/models
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/landingpage/
 */

var db = require('../database/database')
var message  = require('../constants/message')
var table  = require('../constants/table')
var redirectModel = require('./redirect-model')
var visitModel = require('./visit-model')

var landingpageModel = {
  addAgentInfo: addAgentInfo,
  addAgentData: addAgentData
}

/**
 * Function that add agent info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  agentInfo
 * @return  object  if success returns object else returns message
 */
function addAgentInfo(agentInfo) {
  return new Promise((resolve, reject) => {
    let pageUrl = ''

    if (!agentInfo.uid) {
      db.query(`INSERT INTO ${table.USER_LIST}(email, password) VALUES('', '')`, (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          let userId = rows.insertId
          visitModel.checkVisitSessionWithExtraInfo(db, userId, agentInfo, false , false, false).then((result) =>{
            pageUrl = 'signup'
            let data = { uid:userId, url:pageUrl}
            resolve(data)
          })
        }
      })
    } else { 
      visitModel.checkVisitSessionWithExtraInfo(db, agentInfo.uid, agentInfo, false , false, false).then((result) =>{
        if (result) {
          let query = 'SELECT * FROM ' + table.VISIT_LIST + ' WHERE uid = ? ORDER BY updated_date DESC'
          db.query(query, [agentInfo.uid], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              pageUrl = redirectModel.checkUncompletedPage(rows[0])
              let data = { uid:agentInfo.uid, url:pageUrl}
              resolve(data)
            }
          })  
        } else {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        }
      })
    }
  })
}

/**
 * Function that add agent info
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object  agentInfo
 * @return  object  if success returns object else returns message
 */
function addAgentData(agentData) {
  return new Promise((resolve, reject) => {

    if (!agentData.uid) {
      db.query(`INSERT INTO ${table.USER_LIST}(email, password) VALUES('', '')`, (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          let userId = rows.insertId
          visitModel.checkVisitSessionWithExtraInfo(db, userId, agentData, false , false, false).then((result) =>{
            let data = { uid:userId }
            resolve(data)
          })
        }
      })
    } else {
      let data = { uid:agentData.uid }
      resolve(data)
    }
  })
}

module.exports = landingpageModel
