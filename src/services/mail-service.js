/**
 * Mail service file
 * 
 * @package   backend/src/services
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/mail/
 */

var message = require('../constants/message')
var code = require('../constants/code')
var csv = require("fast-csv")
var mailModel = require('../models/mail/mail-model')

var mailService = {
  saveMailList: saveMailList,
  mailValidation: mailValidation,
  getFakeEmailInfo: getFakeEmailInfo,
  sendTestEmail: sendTestEmail,
  sendEmail: sendEmail,
  sendEmailViaMixmax: sendEmailViaMixmax,
  getAllEmailInfo: getAllEmailInfo,
  sendEmailViaSendGrid: sendEmailViaSendGrid
}

/**
 * Function that save resume page information
 *
 * @author  DongTuring <ying@turing.com>
 * @return  json 
 */
 function saveMailList(filePath) {
  var array = [];
  return new Promise((resolve, reject) => {
    csv.fromPath(filePath, {headers : true, ignoreEmpty: true})
    .on("data", function(data) {
      array.push(data)
    })
    .on("end", function() {
        console.log("done")
        if (array.length > 0) {
          let uploadedDate = new Date()
          for (let i = 0 ; i < array.length; i ++) {
            mailModel.saveInfo(array[i], uploadedDate).then((result) => {
              if (result) {
                if (i === (array.length - 1)) {
                  resolve({ code: code.OK, message: '', data: {} })
                } 
              } else {
                i ++
              }
            })
          }
        } else {
          resolve({ code: code.OK, message: '', data: {} })
        }
    }) 
  })
}

/**
 * Function that save resume page information
 *
 * @author  DongTuring <ying@turing.com>
 * @return  json 
 */
function mailValidation() {
  return new Promise((resolve, reject) => {
    mailModel.mailValidation().then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: {} })
      } else {
        resolve({ code: code.INTERNAL_SERVER_ERROR, message: '', data: {} })
      }
    })
  })
}

/**
 * Function that get fake email infos
 *
 * @author  DongTuring <ying@turing.com>
 * @return  json 
 */
function getFakeEmailInfo(data) {
  return new Promise((resolve, reject) => {
    mailModel.getFakeEmailInfo(data).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: result })
      } else {
        resolve({ code: code.OK, message: '', data: { rows: [], count:0 } })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: { rows: [], count:0 } })
    })
  })
}

/**
 * Function that get all imported email infos
 *
 * @author  DongTuring <ying@turing.com>
 * @return  json 
 */
function getAllEmailInfo(data) {
  return new Promise((resolve, reject) => {
    mailModel.getAllEmailInfo(data).then((result) => {
      if (result) {
        resolve({ code: code.OK, message: '', data: result })
      } else {
        resolve({ code: code.OK, message: '', data: { rows: [], count:0 } })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: { rows: [], count:0 } })
    })
  })
}

/**
 * Function that send the test emails
 *
 * @author  DongTuring <ying@turing.com>
 * @return  json 
 */
function sendTestEmail(data) {
  return new Promise((resolve, reject) => {
    mailModel.sendTestEmail(data).then((result) => {
      resolve({ code: code.OK, message: '' })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message })
      else
        reject({ code: code.BAD_REQUEST, message: err.message })
    })
  })
}

/**
 * Function that send the test emails
 *
 * @author  DongTuring <ying@turing.com>
 * @return  json 
 */
function sendEmail(data) {
  return new Promise((resolve, reject) => {
    mailModel.sendEmail(data).then((result) => {
      resolve({ code: code.OK, message: '' })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message })
      else
        reject({ code: code.BAD_REQUEST, message: err.message })
    })
  })
}

/**
 * Function that send the test emails
 *
 * @author  DongTuring <ying@turing.com>
 * @return  json 
 */
function sendEmailViaMixmax() {
  return new Promise((resolve, reject) => {
    mailModel.sendFrontendChallengeEmailViaMixmax('Dong', 'Li', 'dong@turingai.net').then((result) => {
      resolve({ code: code.OK, message: '' })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SEVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message })
      else
        reject({ code: code.BAD_REQUEST, message: err.message })
    })
  })
}

function sendEmailViaSendGrid(sender, receivers, subject, template, senderName, unsubscribeHeader = "", categories=[]){
  return new Promise((resolve, reject) => {
    mailModel.sendEmailViaSendGrid(sender, receivers, subject, template, senderName, unsubscribeHeader, categories).then((response) => {
      if(response)
        resolve(response)
      else
        resolve(false)
    })
  })
}

module.exports = mailService
