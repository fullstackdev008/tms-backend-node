/**
 * Mail router file
 * 
 * @package   backend/src/routes
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/mail
 */

var express = require('express')
var router = express.Router()
const fs = require('fs')
var multer = require('multer')
var PathConstant = require('../constants/path')
const mailService = require('../services/mail-service')
var message = require('../constants/message')
var code = require('../constants/code')
var checkApiKey = require('../middleware/api-key-middleware')
var authMiddleware = require('../middleware/auth-middleware')
var filename = ''

/** 
 * Save resume file to specific path 
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var targetDir = PathConstant.UploadPath.MAILLIST

    if (!fs.existsSync(targetDir))
      fs.mkdirSync(targetDir)

    targetDir = PathConstant.UploadPath.MAILLIST

    if (!fs.existsSync(targetDir))
      fs.mkdirSync(targetDir)

    cb(null, targetDir)
  },
  filename: function (req, file, cb) {
    filename = Date.now() + '_' + file.originalname
    cb(null, filename)
  }
})

/** 
 * Send forgot pass email
 */
router.post('/save-mail-list', authMiddleware.checkAdminToken, multer({ storage: storage }).single('file'), saveMailList)

/** 
 * Validate email
 */
router.post('/validation', authMiddleware.checkAdminToken, mailValidation)

/** 
 * Validate email
 */
router.get('/fake-email', authMiddleware.checkAdminToken, getFakeEmailInfo)

/** 
 * Get all imported emails
 */
router.get('/all-email', authMiddleware.checkAdminToken, getAllEmailInfo)

/** 
 * send test email
 */
router.post('/send-test-email', authMiddleware.checkAdminToken, sendTestEmail)

/** 
 * send the email
 */
router.post('/send-email', authMiddleware.checkAdminToken, sendEmail)

/** 
 * send the email via mixmax
 */
router.post('/send-email-mixmax', sendEmailViaMixmax)

/** 
 * send the email via api
 */
router.post('/api-send-email-sendgrid', checkApiKey.checkApiKey ,apiSendEmailViaSendGrid)

/**
 * Function that save mail list from csv file
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveMailList(req, res) {
  if (filename !== '') {
    let filePath = PathConstant.UploadPath.MAILLIST + filename
    mailService.saveMailList(filePath).then((result) => {
      res.json(result)
    })
  } else {
    res.json({ code : code.INTERNAL_SERVER_ERROR, message: message.UPLOAD_FAILED })      
  }
}

/**
 * Function that validate the emails
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function mailValidation(req, res) {
  mailService.mailValidation().then((result) => {
    res.json(result)
  })
}

/**
 * Function that validate the emails
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getFakeEmailInfo(req, res) {
  let data = {
    page: req.query.page,
    rowsPerPage: req.query.rowsPerPage
  }
  mailService.getFakeEmailInfo(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that get all imported emails
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getAllEmailInfo(req, res) {
  let data = {
    page: req.query.page,
    rowsPerPage: req.query.rowsPerPage
  }
  mailService.getAllEmailInfo(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that send the test emails
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function sendTestEmail(req, res) {
  let data = {
    name: '',
    from: '',
    subject: ''
  }
  mailService.sendTestEmail(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that send the emails
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function sendEmail(req, res) {
  let data = {
    name: '',
    from: '',
    subject: ''
  }
  mailService.sendEmail(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)      
  })
}

/**
 * Function that send the emails
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function sendEmailViaMixmax(req, res) {
  mailService.sendEmailViaMixmax().then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that send the emails
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function apiSendEmailViaSendGrid(req, res) {
  var { sender, receivers, subject, template, senderName, unsubscribeHeader, category} = req.body

  if (!sender) {
    return res.status(400).json({'error': 'Sender address required'});
  }

  if (!receivers) {
    return res.status(400).json({'error': 'receivers required'});
  }

  if (!subject) {
    return res.status(400).json({'error': 'Email Subject required'});
  }

  if (!template) {
    return res.status(400).json({'error': 'Email Template required'});
  }

  if (!category) {
    return res.status(400).json({'error': 'Email Category required'});
  }

  if (senderName === '') {
    senderName = 'Turing'
  }

  let categories = []
  if (!Array.isArray(category)) {
    categories = [category]
  } else {
    categories = category
  }

  mailService.sendEmailViaSendGrid(sender, receivers, subject, template, senderName, unsubscribeHeader, categories).then(result => {
    res.json(result)
  }).catch(err => {
    res.json(err)
  })
}

module.exports = router
