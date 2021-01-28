/**
 * Dashboard router file
 *
 * @package   backend/src/routes
 * @author    YingTuring <ying@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/dashboard/
 */

const express = require('express')
const router = express.Router()
const fs = require('fs')
var multer = require('multer')
var mime = require('mime-types')
const uuidv4 = require('uuid/v4')
var pdfUtil = require('pdf-to-text');
var textract = require('textract');
var PathConstant = require('../constants/path'), UploadPath = PathConstant.UploadPath
var dashboardService = require('../services/dashboard-service')
var authMiddleware = require('../middleware/auth-middleware')
const uploadResume2GCS = require('../services/gcs-service').uploadResume2GCS;
const uploadAvatar2GCS = require('../services/gcs-service').uploadAvatar2GCS;
const uploadSystemDesign2GCS = require('../services/gcs-service').uploadSystemDesign2GCS;
const uploadProductDesign2GCS = require('../services/gcs-service').uploadProductDesign2GCS;

require('promise.prototype.finally').shim()
const LogService = require('../services/log-service');
const fileUpload = require('express-fileupload');

/** 
 * Save image filename
 */
var filename = ''

const fileUploadMiddleware = fileUpload()
/** 
 * Save image to path
 */
const storage = (targetDir = UploadPath.UPLOADORIGIN) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(targetDir))
        fs.mkdirSync(targetDir)

      cb(null, targetDir)
    },
    filename: function (req, file, cb) {
      filename = uuidv4() + '_' + file.originalname
      cb(null, filename)
    }
  })
}

/**
 * Save the auto hosting build status
 */
router.post('/save_auto_host_status', saveAutoHostBuildStatus)

/** 
 * Get user id from token 
 */
router.use(authMiddleware.checkToken)

/** 
 * Get personal info API
 */
router.get('/get-profile-info', getProfileInfo)

/** 
 * Get Account info API
 */
router.get('/get-account-info', getAccountInfo)

/** 
 * Get test result info API
 */
router.get('/get-test-result', getTestResult)

/** 
 * Save personal info API
 */
router.post('/update-profile-info', multer({ storage: storage(UploadPath.RESUME) }).single('file'), updateProfileInfo)

/** 
 * Save Expertise API
 */
router.post('/set-expertise', setExpertise)

/** 
 * Save Skill API
 */
router.post('/set-skill', setSkill)

/** 
 * Change password API
 */
router.post('/change-password', changePassword)

/** 
 * Delete Account API
 */
router.delete('/delete-account', deleteAccount)

/** 
 * Get challenge type API
 */
router.get('/get_challenge_type', getChallengeType)

/** 
 * Get challenge info API
 */
router.post('/get_challenge_info', getChallengeInfo)

/**
 * Send email to turing manager after the user submitted challenge 
 */
router.post('/send-email-to-manager', sendEmailToManager)

/**
 * Save show description button selected value
 */
router.post('/save-show-description-track', saveShowDescriptionTrack)

/**
 * Get the auto hosting link
 */
router.post('/get_host_link', multer({ storage: storage(UploadPath.SOURCECODE) }).single('file'), getAutoHostLink)

/**
 * Get Autohost build status
 */
router.get('/get_autohost_build_status', getAutoHostBuildStatus)

/**
 * Get certifications list
 */
router.get('/get-certifications-list', getCertificationsList)

/**
 * Get all skills list
 */
router.get('/get-all-skils-list', getAllSkillsList)

/**
 * Save personal info
 */
router.post('/save-personal-info', savePersonalInfo)

/**
 * Save resume
 */
router.post('/save-resume', fileUploadMiddleware, saveResume)

/**
 * Save avatar
 */
router.post('/save-avatar', fileUploadMiddleware, saveAvatar)

/**
 * Save answer pdf file for system design
 */
router.post('/save-system-design', fileUploadMiddleware, saveSystemDesign)

/**
 * Save answer pdf file for product design
 */
router.post('/save-product-design', fileUploadMiddleware, saveProductDesign)

/**
 * Save personal info
 */
router.get('/get-personal-info', getPersonalInfo)

/**
 * save technical skill
 */
router.post('/save-technical-skill', saveTechnicalSkill)

/**
 * Edit technical skill
 */
router.put('/edit-technical-skill/:id', editTechnicalSkill)

/**
 * delete technical skill
 */
router.delete('/delete-technical-skill/:id', deleteTechnicalSkill)

/**
 * Get Skills for developer
 */
router.get('/get-technical-skills', getTechnicalSkills)

/**
 * save experience
 */
router.post('/save-experience', saveExperience)

/**
 * Edit experience
 */
router.put('/edit-experience/:id', editExperience)

/**
 * delete experience 
 */
router.delete('/delete-experience/:id', deleteExperience)

/**
 * Get user experience
 */
router.get('/get-user-experience', getUserExperience)

/**
 * save education
 */
router.post('/save-education', saveEducation)

/**
 * Edit education
 */
router.put('/edit-education/:id', editEducation)

/**
 * delete education 
 */
router.delete('/delete-education/:id', deleteEducation)

/**
 * Get user education
 */
router.get('/get-user-education', getUserEducation)

/**
 * save certificatoin
 */
router.post('/save-certification', saveCertification)

/**
 * Edit certification
 */
router.put('/edit-certification/:id', editCertification)

/**
 * delete certification 
 */
router.delete('/delete-certification/:id', deleteCertification)

/**
 * Get user certification
 */
router.get('/get-user-certifications', getUserCertifications)

/**
 * save project
 */
router.post('/save-project', saveProject)

/**
 * Edit project
 */
router.put('/edit-project/:id', editProject)

/**
 * delete project 
 */
router.delete('/delete-project/:id', deleteProject)

/**
 * Get user projects
 */
router.get('/get-user-projects', getUserProjects)

/**
 * save publication
 */
router.post('/save-publication', savePublication)

/**
 * Edit publication
 */
router.put('/edit-publication/:id', editPublication)

/**
 * delete publication 
 */
router.delete('/delete-publication/:id', deletePublication)

/**
 * Get user publications
 */
router.get('/get-user-publications', getUserPublications)

/**
 * Get system design info
 */
router.get('/get-system-design', getUserSystemDesign)

/**
 * Get product design
 */
router.get('/get-product-design', getUserProductDesign)

/**
 * Function that get personal information
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getProfileInfo(req, res) {
  var userId = req.decoded.uid

  dashboardService.getPersonalData(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get account information
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getAccountInfo(req, res) {
  var userId = req.decoded.uid

  dashboardService.getAccountInfo(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get test result
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getTestResult(req, res) {
  var userId = req.decoded.uid

  dashboardService.getTestResult(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that update personal information
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function updateProfileInfo(req, res) {
  var userId = req.decoded.uid
  var bodyObject = JSON.parse(req.body.data)

  var userData = {
    userId: userId,
    first_name: bodyObject.first_name,
    last_name: bodyObject.last_name,
    phone_number: bodyObject.phone_number,
    country: bodyObject.country,
    recent_employer: bodyObject.recent_employer,
    recent_position: bodyObject.recent_position,
    linkedin_url: bodyObject.linkedin_url,
    resumeFile: filename
  }

  dashboardService.savePersonalData(userData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save Expertise
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function setExpertise(req, res) {
  var userId = req.decoded.uid

  var expertiseData = {
    userId: userId,
    expertise: req.body.expertise
  }

  dashboardService.saveExpertise(expertiseData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save skill
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function setSkill(req, res) {
  var userId = req.decoded.uid

  var skillData = {
    userId: userId,
    skill: req.body.skill
  }

  dashboardService.saveSkill(skillData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that change password
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function changePassword(req, res) {
  var userId = req.decoded.uid

  var passwordData = {
    userId: userId,
    oldPwd: req.body.oldPwd,
    newPwd: req.body.newPwd
  }

  dashboardService.changePassword(passwordData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that delete account
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function deleteAccount(req, res) {
  var userId = req.decoded.uid

  dashboardService.deleteAccount(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get challenge type
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getChallengeType(req, res) {
  dashboardService.getChallengeType().then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get challenge infos
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getChallengeInfo(req, res) {
  var userId = req.decoded.uid

  var challengeInfoData = {
    userId: userId,
    typeName: req.body.typeName,
  }

  dashboardService.getChallengeInfo(challengeInfoData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that send email to turing manager
 * 
 * @author  WangTuring <wangwang@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function sendEmailToManager(req, res) {
  let userId = req.decoded.uid
  challengeType = req.body.challengeType

  dashboardService.sendEmailToManager(userId, challengeType).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save show description track value
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveShowDescriptionTrack(req, res) {
  var userId = req.decoded.uid

  var trackData = {
    userId: userId,
    challenge_name: req.body.challenge_name,
    value: req.body.value
  }

  dashboardService.saveShowDescriptionTrack(trackData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function to trigger the autohost jenkins build
 *
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  a promise of object with the autohost link
 */
function getAutoHostLink(req, res) {
  try {
    const { challengeLanguage, challengeType, sourceType, estimatedTime, githubLink, appName, challengeTypeId } = JSON.parse(req.body.data);
    const autoHostData = {
      filePath: req.file.path,
      userId: req.decoded.uid,
      challengeName: challengeType,
      challengeTypeId: challengeTypeId,
      language: challengeLanguage,
      estimatedTime: estimatedTime,
      sourceType: sourceType,
      githubLink: githubLink,
      appName: appName,
    }
    LogService.info('Auto Host Data Received', autoHostData);
    dashboardService.getAutoHostLink(autoHostData).then((result) => {
      res.json(result)
    }).catch((err) => {
      console.log(err);
      res.json(err)
    })
  } catch (err) {
    console.log(err);
    res.json(err);
  }
}

/**
 * Function to save the autohost build status
 *
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  a promise of object with the autohost link
 */
function saveAutoHostBuildStatus(req, res) {
  const { build_status, host_link, user_id } = req.body;
  const autoHostData = {
    buildStatus: build_status,
    hostLink: host_link,
    userId: user_id,
  }
  LogService.info('Auto Host Build Data Received', autoHostData);
  dashboardService.saveAutoHostBuildStatus(autoHostData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function to get the autohost build status
 *
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  a promise of object with the autohost status
 */
function getAutoHostBuildStatus(req, res) {
  const { host_link } = req.query;
  dashboardService.getAutoHostBuildStatus(host_link).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that gets list of certifications 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getCertificationsList(req, res) {
  var userId = req.query.userId ? req.query.userId : req.decoded.uid

  dashboardService.getCertificationsList(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that gets list of all skills 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getAllSkillsList(req, res) {
  var userId = req.query.userId ? req.query.userId : req.decoded.uid
  dashboardService.getAllSkillsList(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves personal data
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function savePersonalInfo(req, res) {
  var userId = req.decoded.uid
  var userInfo = {
    developer_id: userId,
    full_name: req.body.fullName,
    role: req.body.preferredStack,
    email: req.body.email,
    phone_number: req.body.phoneNumber,
    working_hours_start: req.body.workingStartTime,
    working_hours_end: req.body.workingEndTime,
    country: req.body.country,
    years_of_experience: req.body.yearsOfExperience,
    years_of_working_remotely: req.body.yearsOfWorkingRemotely
  }

  dashboardService.savePersonalInfo(userInfo).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves resume
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
async function saveResume(req, res) {
  var userId = req.decoded.uid
  var userInfo = {
    developer_id: userId,
    resume: ''
  }
  if (req.files && req.files.resume) {
    try {
      userInfo.resume = await uploadResume2GCS(req.files.resume);
    } catch (err) {
      res.json(err.message)
      return;
    }

    if (req.files.resume.mimetype === 'application/pdf') {
      pdfUtil.pdfToText('public/upload/resume/' + userInfo.resume, function (err, data) {
        if (!err) {
          let plainResumeInfo = {
            developer_id: userId,
            resume_plain: data
          }
          dashboardService.savePlainResume(plainResumeInfo)
        }
      });
    } else {
      textract.fromFileWithPath('public/upload/resume/' + userInfo.resume, function (err, data) {
        if (!err) {
          let plainResumeInfo = {
            developer_id: userId,
            resume_plain: data
          }
          dashboardService.savePlainResume(plainResumeInfo)
        }
      })
    }
  }

  dashboardService.saveResume(userInfo).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves the answer file for system design
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
async function saveSystemDesign(req, res) {
  var userId = req.decoded.uid
  var userInfo = {
    developer_id: userId,
    answer_file: ''
  }
  if (req.files && req.files.answer_file) {
    try {
      userInfo.answer_file = await uploadSystemDesign2GCS(req.files.answer_file);
    } catch (err) {
      res.json(err.message)
      return;
    }
  }

  dashboardService.saveSystemDesign(userInfo).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves the answer file for product design
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
async function saveProductDesign(req, res) {
  var userId = req.decoded.uid
  var userInfo = {
    developer_id: userId,
    answer_file: ''
  }
  if (req.files && req.files.answer_file) {
    try {
      userInfo.answer_file = await uploadProductDesign2GCS(req.files.answer_file);
    } catch (err) {
      res.json(err.message)
      return;
    }
  }

  dashboardService.saveProductDesign(userInfo).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves avatar
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
async function saveAvatar(req, res) {
  var userId = req.decoded.uid
  var userInfo = {
    developer_id: userId,
    avatar: ''
  }

  if (req.files && req.files.avatar) {
    try {
      userInfo.avatar = await uploadAvatar2GCS(req.files.avatar);
    } catch (err) {
      res.json(err.message)
      return;
    }
  }

  dashboardService.saveAvatar(userInfo).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves personal data
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getPersonalInfo(req, res) {
  var userId = req.query.userId ? req.query.userId : req.decoded.uid
  dashboardService.getPersonalInfo(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves technical skill
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveTechnicalSkill(req, res) {
  var userId = req.decoded.uid
  var userSkill = {
    developer_id: userId,
    skill_id: req.body.cSkillId,
    score: req.body.cYear
  }
  dashboardService.saveTechnicalSkill(userSkill).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that edits technical skill
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function editTechnicalSkill(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userSkill = {
    id: id,
    developer_id: userId,
    skill_id: req.body.cSkillId,
    score: req.body.cYear
  }
  dashboardService.editTechnicalSkill(userSkill).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that deletes technical skill
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function deleteTechnicalSkill(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userSkill = {
    id: id,
    developer_id: userId
  }
  dashboardService.deleteTechnicalSkill(userSkill).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that retrieves technical skills
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getTechnicalSkills(req, res) {
  var userId = req.query.userId ? req.query.userId : req.decoded.uid
  dashboardService.getTechnicalSkills(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves user experience 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveExperience(req, res) {
  var userId = req.decoded.uid
  var userExperience = {
    developer_id: userId,
    position: req.body.cPosition,
    company: req.body.cCompany,
    start_year: req.body.cStartYear,
    start_month: req.body.cStartMonth,
    end_year: req.body.cEndYear,
    end_month: req.body.cEndMonth,
    details: req.body.cDetails,
    url: req.body.cUrl
  }
  dashboardService.saveExperience(userExperience).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that edits user experience
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function editExperience(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userExperience = {
    id: id,
    developer_id: userId,
    position: req.body.cPosition,
    company: req.body.cCompany,
    start_year: req.body.cStartYear,
    start_month: req.body.cStartMonth,
    end_year: req.body.cEndYear,
    end_month: req.body.cEndMonth,
    details: req.body.cDetails,
    url: req.body.cUrl
  }
  dashboardService.editExperience(userExperience).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that deletes user experience
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function deleteExperience(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userExperience = {
    id: id,
    developer_id: userId
  }
  dashboardService.deleteExperience(userExperience).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that retrieves user experience
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getUserExperience(req, res) {
  var userId = req.query.userId ? req.query.userId : req.decoded.uid
  dashboardService.getUserExperience(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}


/**
 * Function that saves user education 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveEducation(req, res) {
  var userId = req.decoded.uid
  var userEducation = {
    developer_id: userId,
    degree: req.body.cDegree,
    college: req.body.cCollege,
    start_year: req.body.cStartYear,
    start_month: req.body.cStartMonth,
    end_year: req.body.cEndYear,
    end_month: req.body.cEndMonth
  }
  dashboardService.saveEducation(userEducation).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that edits user education
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function editEducation(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userEducation = {
    id: id,
    developer_id: userId,
    degree: req.body.cDegree,
    college: req.body.cCollege,
    start_year: req.body.cStartYear,
    start_month: req.body.cStartMonth,
    end_year: req.body.cEndYear,
    end_month: req.body.cEndMonth
  }
  dashboardService.editEducation(userEducation).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that deletes user education
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function deleteEducation(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userEducation = {
    id: id,
    developer_id: userId
  }
  dashboardService.deleteEducation(userEducation).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that retrieves user education
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getUserEducation(req, res) {
  var userId = req.query.userId ? req.query.userId : req.decoded.uid
  dashboardService.getUserEducation(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}


/**
 * Function that saves user certification 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveCertification(req, res) {
  var userId = req.decoded.uid
  var userCertification = {
    developer_id: userId,
    certification_id: req.body.cCertId,
    year: req.body.cYear
  }
  dashboardService.saveCertification(userCertification).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that edits user certification
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function editCertification(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userCertification = {
    id: id,
    developer_id: userId,
    certification_id: req.body.cCertId,
    year: req.body.cYear
  }
  dashboardService.editCertification(userCertification).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that deletes user certification
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function deleteCertification(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userCertification = {
    id: id,
    developer_id: userId
  }
  dashboardService.deleteCertification(userCertification).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that retrieves user certification
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getUserCertifications(req, res) {
  var userId = req.query.userId ? req.query.userId : req.decoded.uid
  dashboardService.getUserCertifications(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}


/**
 * Function that saves user's project 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveProject(req, res) {
  var userId = req.decoded.uid
  var userProject = {
    developer_id: userId,
    project_name: req.body.cProjectName,
    start_year: req.body.cStartYear,
    start_month: req.body.cStartMonth,
    end_year: req.body.cEndYear,
    end_month: req.body.cEndMonth,
    details: req.body.cDetails,
    url: req.body.cUrl
  }
  dashboardService.saveProject(userProject).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that edits user's project
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function editProject(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userProject = {
    id: id,
    developer_id: userId,
    project_name: req.body.cProjectName,
    start_year: req.body.cStartYear,
    start_month: req.body.cStartMonth,
    end_year: req.body.cEndYear,
    end_month: req.body.cEndMonth,
    details: req.body.cDetails,
    url: req.body.cUrl
  }
  dashboardService.editProject(userProject).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that deletes user's project
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function deleteProject(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userProject = {
    id: id,
    developer_id: userId
  }
  dashboardService.deleteProject(userProject).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that retrieves user's projects
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getUserProjects(req, res) {
  var userId = req.query.userId ? req.query.userId : req.decoded.uid
  dashboardService.getUserProjects(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that saves user's publications 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function savePublication(req, res) {
  var userId = req.decoded.uid
  var userPublicaiton = {
    developer_id: userId,
    title: req.body.cTitle,
    year: req.body.cYear,
    link: req.body.cLink
  }
  dashboardService.savePublication(userPublicaiton).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that edits user's publication
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function editPublication(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userPublicaiton = {
    id: id,
    developer_id: userId,
    title: req.body.cTitle,
    year: req.body.cYear,
    link: req.body.cLink
  }
  dashboardService.editPublication(userPublicaiton).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that deletes user's publication
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function deletePublication(req, res) {
  var userId = req.decoded.uid
  var id = req.params.id
  var userPublicaiton = {
    id: id,
    developer_id: userId
  }
  dashboardService.deletePublication(userPublicaiton).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that retrieves user's publications
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getUserPublications(req, res) {
  var userId = req.query.userId ? req.query.userId : req.decoded.uid
  dashboardService.getUserPublications(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that retrieves user's system design
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getUserSystemDesign(req, res) {
  var userId = req.decoded.uid
  dashboardService.getUserSystemDesign(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that retrieves user's product design
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function getUserProductDesign(req, res) {
  var userId = req.decoded.uid
  dashboardService.getUserProductDesign(userId).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

module.exports = router