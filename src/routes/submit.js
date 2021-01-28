/**
 * Submit router file
 * 
 * @package   backend/src/routes
 * @author    DongTuring <dong@turing.com>
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/submit/
 */

const express = require('express')
const router = express.Router()
const fs = require('fs')
var multer = require('multer')
var mime = require('mime-types')
var PathConstant = require('../constants/path'), UploadPath = PathConstant.UploadPath
var submitService = require('../services/submit-service')
var authMiddleware = require('../middleware/auth-middleware')

var filename = ''

/** 
 * Save resume file to specific path 
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var targetDir = UploadPath.UPLOADORIGIN

    if (!fs.existsSync(targetDir))
      fs.mkdirSync(targetDir)

    targetDir = UploadPath.RESUME

    if (!fs.existsSync(targetDir))
      fs.mkdirSync(targetDir)

    cb(null, targetDir)
  },
  filename: function (req, file, cb) {
    filename = Date.now() + '_' + file.originalname
    cb(null, filename)
  }
})

router.use(authMiddleware.checkToken)

router.get('/get-resume-info', getResumeInfo)
router.post('/save-resume-info', saveResumeInfo)
router.post('/save-resume', multer({ storage: storage }).single('file'), saveResume)
router.get('/linkedin/oauth', linkedinOAuth)
router.get('/linkedin/callback', linkedinCallback)
router.post('/save-remote-exp-info', saveRemoteExpInfo)
router.get('/get-remote-exp-info', getRemoteExpInfo)
router.post('/save-profile-info', saveProfileInfo)
router.get('/get-profile-info', getProfileInfo)
router.post('/save-notdev-profile-info', saveNotdevProfileInfo)
router.get('/get-notdev-profile-info', getNotdevProfileInfo)
router.get('/get-jobs-skills-info', getJobsSkillsInfo)
router.post('/save-jobs-info', saveJobsInfo)
router.post('/save-skills-info', saveSkillsInfo)
router.get('/get-base-jobs-info', getBaseJobsInfo)
router.get('/get-base-skills-info', getBaseSkillsInfo)
router.get('/get-base-all-skills-info', getBaseAllSkillsInfo)
router.post('/save-home-challenge-option', saveHomeChallengeOption)
router.get('/get-selected-language', getSelectedLanguageInfo)
router.post('/unlock-challenge', unlockChallenge)
router.post('/save-user-exp-info', saveUserExperience)

/**
 * Function that get resume page information 
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getResumeInfo(req, res) {
  var userId = req.decoded.uid

  submitService.getResumeInfo(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save resume page information
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveResumeInfo(req, res) {
  var userId = req.decoded.uid

  var flowData = {
    userId: userId,
    inputValue: req.body.inputValue,
    fieldName: req.body.fieldName,
  }

  submitService.saveResumeInfo(flowData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save resume file
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveResume(req, res) {
  var userId = req.decoded.uid

  var resumeData = {
    userId: userId,
    resumeFile: filename,
  }

  submitService.saveResume(resumeData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that authenticate linkedin.
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function linkedinOAuth(req, res) {
  var callback = req.protocol + '://' + req.headers.host + '/api/submit/linkedin/callback'

  submitService.linkedinOAuth(callback).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that calls linkedin callback.
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function linkedinCallback(req, res) {
  submitService.linkedinCallback(req, res).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save remote experience info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function saveRemoteExpInfo(req, res) {
  let data = {
    userId: req.decoded.uid,
    rhValue: req.body.rhValue,
    rpValue: req.body.rpValue,
    rcValue: req.body.rcValue,
    hcValue: req.body.hcValue
  }

  submitService.saveRemoteExpInfo(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that fetch remote experience info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getRemoteExpInfo(req, res) {
  let userId = req.decoded.uid

  submitService.getRemoteExpInfo(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save profile information
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveProfileInfo(req, res) {
  let data = {
    userId: req.decoded.uid,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber
  }

  submitService.saveProfileInfo(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that fetch profile information
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getProfileInfo(req, res) {
  let userId = req.decoded.uid

  submitService.getProfileInfo(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save not developer profile info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveNotdevProfileInfo(req, res) {
  let data = {
    userId: req.decoded.uid,
    profession: req.body.profession,
    linkedinUrl: req.body.linkedinUrl,
    resumePath: req.body.resumePath
  }

  submitService.saveNotdevProfileInfo(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get not developer profile info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getNotdevProfileInfo(req, res) {
  let userId = req.decoded.uid

  submitService.getNotdevProfileInfo(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save jobs and levels
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveJobsInfo(req, res) {
  var data = {
    userId: req.decoded.uid,
    jobList: req.body.jobList,
    levelList: req.body.levelList
  }

  submitService.saveJobsInfo(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get jobs and skills info for user
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getJobsSkillsInfo(req, res) {
  let userId = req.decoded.uid

  submitService.getJobsSkillsInfo(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save skills and levels
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveSkillsInfo(req, res) {
  var data = {
    userId: req.decoded.uid,
    skillList: req.body.skillList,
    levelList: req.body.levelList
  }

  submitService.saveSkillsInfo(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get base jobs info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getBaseJobsInfo(req, res) {
  submitService.getBaseJobsInfo().then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get base skills info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getBaseSkillsInfo(req, res) {
  let userId = req.decoded.uid
  
  submitService.getBaseSkillsInfo(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get base all skills info for auto-completed
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getBaseAllSkillsInfo(req, res) {
  submitService.getBaseAllSkillsInfo().then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save taking home challenge option
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveHomeChallengeOption(req, res) {
  let data = {
    userId: req.decoded.uid,
    option: req.body.option
  }

  submitService.saveHomeChallengeOption(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get selected language name
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object  req
 * @param   object  res
 * @return  json 
 */
function getSelectedLanguageInfo(req, res) {
  let userId = req.decoded.uid

  submitService.getSelectedLanguageInfo(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that unlock challenges
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function unlockChallenge(req, res) {
  let userId = req.decoded.uid
  
  submitService.unlockChallenge(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}


/**
 * Function that unlock challenges
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveUserExperience(req, res) {
  let data = {
    uid: req.decoded.uid,
    englishSkill: req.body.english_skill,
    englishExperience: JSON.stringify(req.body.english_experience),
    softwareEngineerExperience: req.body.software_engineer_experience, 
    engineeringManagerExperience: req.body.engineering_manager_experience,
    spendingTimeOn: JSON.stringify(req.body.spending_time_on),
    availability: req.body.availability,
  }

  submitService.saveUserExperience(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

module.exports = router
