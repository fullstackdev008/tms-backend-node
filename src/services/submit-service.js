/**
 * Submit flow service file
 * 
 * @package   backend/src/services
 * @author    YingTuring <ying@turing.com>
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/submit/
 */

var submitModel = require('../models/submit-model')
var mailModel = require('../models/mail/mail-model')
var message = require('../constants/message')
var code = require('../constants/code')

var submitService = {
  getResumeInfo: getResumeInfo,
  saveResumeInfo: saveResumeInfo,
  saveResume: saveResume,
  linkedinOAuth: linkedinOAuth,
  linkedinCallback: linkedinCallback,
  saveRemoteExpInfo: saveRemoteExpInfo,
  getRemoteExpInfo: getRemoteExpInfo,
  saveProfileInfo: saveProfileInfo,
  getProfileInfo: getProfileInfo,
  saveNotdevProfileInfo: saveNotdevProfileInfo,
  getNotdevProfileInfo: getNotdevProfileInfo,
  saveJobsInfo: saveJobsInfo,
  getJobsSkillsInfo: getJobsSkillsInfo,
  saveSkillsInfo: saveSkillsInfo,
  getBaseJobsInfo: getBaseJobsInfo,
  getBaseSkillsInfo: getBaseSkillsInfo,
  getBaseAllSkillsInfo: getBaseAllSkillsInfo,
  saveHomeChallengeOption: saveHomeChallengeOption,
  getSelectedLanguageInfo: getSelectedLanguageInfo,
  unlockChallenge: unlockChallenge,
  saveUserExperience: saveUserExperience
}

/**
 * Function that get data for resume page
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int  userId
 * @return  json 
 */
function getResumeInfo(userId) {
  return new Promise((resolve, reject) => {
    submitModel.getResumeInfo(userId).then((data) => {
      var resumeData = {
        'country': data.user_country,
        'linkedinUrl': data.linkedin_url,
        'employer': data.recent_employer,
        'position': data.recent_position,
        'resume': data.resume_path
      }

      resolve({ code: code.OK, message: '', data: { 'resumeInfo': resumeData } })
    }).catch((err) => {
      if (err.message == message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that save resume page data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object  flowData
 * @return  json 
 */
function saveResumeInfo(flowData) {
  return new Promise((resolve, reject) => {
    submitModel.saveResumeInfo(flowData).then((data) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that save resume file
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object resumeData
 * @return  json 
 */
function saveResume(resumeData) {
  return new Promise((resolve, reject) => {
    submitModel.saveResume(resumeData).then((data) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message == message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that authenticates linkedin
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  json 
 */
function linkedinOAuth(callback) {
  return new Promise((resolve, reject) => {
    submitModel.linkedinOAuth(callback).then((data) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that calls linkedin callback
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  json 
 */
function linkedinCallback(req, res) {
  return new Promise((resolve, reject) => {
    submitModel.linkedinCallback(req, res).then((data) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that save remote experience data
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  formData
 * @return  json 
 */
function saveRemoteExpInfo(formData) {
  return new Promise((resolve, reject) => {
    submitModel.saveRemoteExpInfo(formData).then((data) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that fetch remote experience data
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   int   userId
 * @return  json 
 */
function getRemoteExpInfo(userId) {
  return new Promise((resolve, reject) => {
    submitModel.getRemoteExpInfo(userId).then((res) => {
      resolve({ code: code.OK, message: '', data: res })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that save profile info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  json 
 */
function saveProfileInfo(data) {
  return new Promise((resolve, reject) => {
    submitModel.saveProfileInfo(data).then((res) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that fetch profile info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  json 
 */
function getProfileInfo(userId) {
  return new Promise((resolve, reject) => {
    submitModel.getProfileInfo(userId).then((res) => {
      resolve({ code: code.OK, message: '', data: res })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that save not developer profile info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  json 
 */
function saveNotdevProfileInfo(data) {
  return new Promise((resolve, reject) => {
    submitModel.saveNotdevProfileInfo(data).then((res) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get not developer profile info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   int   userId
 * @return  json 
 */
function getNotdevProfileInfo(userId) {
  return new Promise((resolve, reject) => {
    submitModel.getNotdevProfileInfo(userId).then((res) => {
      resolve({ code: code.OK, message: '', data: res })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that save jobs and levels
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  json 
 */
function saveJobsInfo(data) {
  return new Promise((resolve, reject) => {
    submitModel.saveJobsInfo(data).then((res) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get jobs and skills info for user
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  json 
 */
function getJobsSkillsInfo(userId) {
  return new Promise((resolve, reject) => {
    submitModel.getJobsSkillsInfo(userId).then((res) => {
      resolve({ code: code.OK, message: '', data: res })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that save skills and levels
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  json 
 */
function saveSkillsInfo(data) {
  return new Promise((resolve, reject) => {
    submitModel.saveSkillsInfo(data).then((res) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get base jobs info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  json 
 */
function getBaseJobsInfo() {
  return new Promise((resolve, reject) => {
    submitModel.getBaseJobsInfo().then((res) => {
      resolve({ code: code.OK, message: '', data: { 'jobs': res } })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get base skills info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  json 
 */
function getBaseSkillsInfo(userId) {
  return new Promise((resolve, reject) => {
    submitModel.getBaseSkillsInfo(userId).then((res) => {
      resolve({ code: code.OK, message: '', data: { 'skills': res } })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get base all skills info for auto-completed
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  json 
 */
function getBaseAllSkillsInfo() {
  return new Promise((resolve, reject) => {
    submitModel.getBaseAllSkillsInfo().then((res) => {
      resolve({ code: code.OK, message: '', data: { 'skills': res } })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that save taking home challenge option
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object  data
 * @return  json 
 */
function saveHomeChallengeOption(data) {
  return new Promise((resolve, reject) => {
    submitModel.saveHomeChallengeOption(data).then((res) => {
      submitModel.getAllInfos(data.userId).then((res) =>{
        if (data.option !== 0) {
          mailModel.sendChallengeEmailViaMixmax(res.first_name, res.last_name, res.email, res.test_language, res.test_date_palindrome, data.option).then((status) => {
            if (status) {
              submitModel.saveSendEmailChallengeDate(data.userId, data.option).then((res) => {
                resolve({ code: code.OK, message: '', data: {} })        
              }).catch((err) => {
                resolve({ code: code.OK, message: '', data: {} })
              })
            } else {
              reject({ code: code.OK, message: message.SEND_CHALLENGE_ERROR, data: {} })
            }
          })
        } else {
          resolve({ code: code.OK, message: '', data: {} })
        }
      }).catch((err) => {
        reject({ code: code.OK, message: message.SEND_CHALLENGE_ERROR, data: {} })
      })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get selected language info
 *
 * @author  DongTuring <dong@turing.com>
 * @param   int  userId
 * @return  json 
 */
function getSelectedLanguageInfo(userId) {
  return new Promise((resolve, reject) => {
    submitModel.getSelectedLanguageInfo(userId).then((testLanguage) => {
      resolve({ code: code.OK, message: '', data: { 'language': testLanguage } })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that unlock challenges
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int  userId
 * @return  json 
 */
function unlockChallenge(userId) {
  return new Promise((resolve, reject) => {
    submitModel.unlockChallenge(userId).then((testLanguage) => {
      resolve({ code: code.OK, message: '', data: {} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that unlock challenges
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object  data
 * @return  json 
 */
function saveUserExperience(data) {
  return new Promise((resolve, reject) => {
    submitModel.saveUserExperience(data).then((resp) => {
      resolve({ code: code.OK, message: '', data: resp })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

module.exports = submitService
