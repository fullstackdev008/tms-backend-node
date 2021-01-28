/**
 * Dashboard service file
 * 
 * @package   backend/src/services
 * @author    YingTuring <ying@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/dashboard/
 */
const fs = require('fs')
const request = require('request')
var dashboardModel = require('../models/dashboard-model')
var mailModel = require('../models/mail/mail-model')
var message = require('../constants/message')
var code = require('../constants/code')
const autoHostConfig = require('../config/autohost-config')
const LogService = require('../services/log-service');

var dashboardService = {
  savePersonalData: savePersonalData,
  saveExpertise: saveExpertise,
  saveSkill: saveSkill,
  changePassword: changePassword,
  getPersonalData: getPersonalData,
  getAccountInfo: getAccountInfo,
  getTestResult: getTestResult,
  deleteAccount: deleteAccount,
  getChallengeType: getChallengeType,
  getChallengeInfo: getChallengeInfo,
  sendEmailToManager: sendEmailToManager,
  saveShowDescriptionTrack: saveShowDescriptionTrack,
  getAutoHostLink: getAutoHostLink,
  getAutoHostBuildStatus: getAutoHostBuildStatus,
  saveAutoHostBuildStatus: saveAutoHostBuildStatus,
  getCertificationsList: getCertificationsList,
  saveTechnicalSkill: saveTechnicalSkill,
  editTechnicalSkill: editTechnicalSkill,
  deleteTechnicalSkill: deleteTechnicalSkill,
  getTechnicalSkills: getTechnicalSkills,
  saveExperience: saveExperience,
  editExperience: editExperience,
  deleteExperience: deleteExperience,
  getUserExperience: getUserExperience,
  savePersonalInfo: savePersonalInfo,
  saveResume: saveResume,
  saveSystemDesign: saveSystemDesign,
  saveProductDesign: saveProductDesign,
  savePlainResume: savePlainResume,
  saveAvatar: saveAvatar,
  saveEducation: saveEducation,
  editEducation: editEducation,
  deleteEducation: deleteEducation,
  getUserEducation: getUserEducation,
  saveCertification: saveCertification,
  editCertification: editCertification,
  deleteCertification: deleteCertification,
  getUserCertifications: getUserCertifications,
  getPersonalInfo: getPersonalInfo,
  saveProject: saveProject,
  editProject: editProject,
  deleteProject: deleteProject,
  getUserProjects: getUserProjects,
  getAllSkillsList: getAllSkillsList,
  savePublication: savePublication,
  editPublication: editPublication,
  deletePublication: deletePublication,
  getUserPublications: getUserPublications,
  getUserSystemDesign: getUserSystemDesign,
  getUserProductDesign: getUserProductDesign
}

/**
 * Function that get personal data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  json 
 */
function getPersonalData(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getPersonalData(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: {'profileData': data} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get account data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  json 
 */
function getTestResult(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getTestResult(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: {'testData': data} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get test result data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  json 
 */
function getAccountInfo(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getAccountInfo(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: {'accountData': data} })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that save personal data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object userData
 * @return  json 
 */
function savePersonalData(userData) {
  return new Promise((resolve, reject) => {
    dashboardModel.savePersonalData(userData).then((data) => {
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
 * Function that save user Expertise
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object expertiseData
 * @return  json 
 */
function saveExpertise(expertiseData) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveExpertise(expertiseData).then((data) => {
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
 * Function that save user skill
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object skillData
 * @return  json 
 */
function saveSkill(skillData) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveSkill(skillData).then((data) => {
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
 * Function that change user's password
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object passwordData
 * @return  json 
 */
function changePassword(passwordData) {
  return new Promise((resolve, reject) => {
    dashboardModel.changePassword(passwordData).then((data) => {
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
 * Function that delete account
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  json 
 */
function deleteAccount(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.deleteAccount(userId).then(() => {
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
 * Function that get challenge type
 *
 * @author  YingTuring <ying@turing.com>
 * @return  json 
 */
function getChallengeType() {
  return new Promise((resolve, reject) => {
    dashboardModel.getChallengeType().then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get challenge infos
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object challenge data
 * @return  json 
 */
function getChallengeInfo(challengeData) {
  return new Promise((resolve, reject) => {
    dashboardModel.getChallengeInfo(challengeData).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves challenge infos
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object challenge data
 * @return  json 
 */
function saveChallengeInfo(challengeData, reSubmission) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveChallengeInfo(challengeData, reSubmission).then((data) => {
      resolve(true);
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that send email to turing manager
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   int userId
 * @param   int challengeType
 * @return  json 
 */
function sendEmailToManager(userId, challengeType) {
  return new Promise((resolve, reject) => {
    dashboardModel.getChallengeAllInfo(userId, challengeType).then((res) =>{
      mailModel.sendEmailToManagerViaMixmax(userId, res.first_name, res.last_name, res.email, res.source_code, res.user_country, res.challenge_name, res.created_date, res.github_link, res.estimated_time, res.host_link).then((status) => {
        if (status) {
          resolve({ code: code.OK, message: '', data: {} })
        } else {
          reject({ code: code.OK, message: message.SEND_FRONTEND_CHALLENGE_ERROR, data: {} })
        }
      })
    }).catch((err) => {
      reject({ code: code.OK, message: message.SEND_FRONTEND_CHALLENGE_ERROR, data: {} })
    })
  })
}

/**
 * Function that save show description track value
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object trackData
 * @return  json 
 */
function saveShowDescriptionTrack(trackData) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveShowDescriptionTrack(trackData).then((data) => {
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
 * Function that saves the autohost build status
 *
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   object autoHostData
 * @return  json
 */
function saveAutoHostBuildStatus(autoHostData) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveAutoHostBuildStatus(autoHostData).then((data) => {
      const {buildStatus, hostLink, userId} = autoHostData;
      dashboardModel.getUserDetailsFromId(userId).then(user => {
        mailModel.sendAutoHostDeployResponse(user, hostLink, buildStatus)
          .then(_ => {})
          .catch(error => LogService.error('Error Occurred Sending Autohost Build Status Email', error))
      }).catch(_ => {})
      resolve('')
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR){
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      }
      return reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

function getTopLevelDomain() {
  return new Promise((resolve, reject) => {
    dashboardModel.getNumberOfHostLinksUsed().then(numberofHostLinksUsed => {
      const extensionPool = autoHostConfig.DOMAIN_POOL.split(',');
      const adminstratorEmails = autoHostConfig.DOMAIN_ADMINSTRATOR_EMAIL.split(',');
      const entriesPerDomain = parseInt(autoHostConfig.ENTRIES_PER_DOMAIN);
      const warningThreshold = parseInt(autoHostConfig.DOMAIN_EXHAUSTION_WARNING_THRESHOLD);

      const extensionPoolLength = extensionPool.length;
      const totalSubdomainAllowed = extensionPoolLength * entriesPerDomain;
      if (numberofHostLinksUsed > totalSubdomainAllowed - warningThreshold) {
        const remainingDomains = totalSubdomainAllowed - numberofHostLinksUsed;
        mailModel.sendAutoHostDomainExhaustionWarning(adminstratorEmails, remainingDomains)
          .then(_ => {})
          .catch(_ => {})
      }
      if (numberofHostLinksUsed >= totalSubdomainAllowed) {
        LogService.error('Subdomains has been used up', {numberofHostLinksUsed, totalSubdomainAllowed});
        return reject({message: message.INTERNAL_SERVER_ERROR});
      }
      // Trying to avoid Zero division error
      numberofHostLinksUsed = numberofHostLinksUsed > 0 ? numberofHostLinksUsed : 1;
      const extensionIndexToUse = Math.floor(numberofHostLinksUsed / entriesPerDomain);
      const extension = extensionPool[extensionIndexToUse];
      return resolve(extension);
    }).catch(err => reject(err));
  });
}

/**
 * Generare the autohost link
 *
 * @author  FrederickTuring <frederick.a@turing.com>
 * @return  autohostlink with a field to denote whether it is fresh or a previous one
 */
function generateAutoHostLink(autoHostData){
  return new Promise((resolve, reject) => {
    const {
      userId,
      challengeName,
      language,
    } = autoHostData;
    dashboardModel.getPreviousHostLink(userId, challengeName, language).then(previousHostLink => {
      if(previousHostLink){
        return resolve({autoHostLink: previousHostLink, reSubmission: true});
      }
      getTopLevelDomain().then(topLevelDomain => {
        // Remove all non word and space then replace all spaces to `-`
        const someRandomSixCharacters = Math.random().toString(36).substring(7);
        let hostLink = `${userId}-${challengeName}-${language}-${someRandomSixCharacters}`.toLowerCase().replace(/[^\w\s-]/gi, '').replace(/[\s]/gi, '-');
        hostLink = `${hostLink}.${topLevelDomain}`;
        return resolve({autoHostLink: hostLink, reSubmission: false});
      }).catch(err => reject(err));
    }).catch(err => reject(err));
  })
}

/**
 * Function to trigger the autohost jenkins build and gets the host link
 *
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   object trackData
 * @return  json
 */
function getAutoHostLink(autoHostData) {
  return new Promise((resolve, reject) => {
    generateAutoHostLink(autoHostData).then(autoHostLinkData => {
      const {autoHostLink, reSubmission} = autoHostLinkData;
      const auth = { username: autoHostConfig.JENKINS_USER, password: autoHostConfig.JENKINS_PASSWORD };
      const {
        filePath,
        userId,
        challengeName,
        language,
        estimatedTime = 0,
        sourceType,
        githubLink,
        appName,
        challengeTypeId
      } = autoHostData;
      const postData = {
        "parameter": [
            {"name":"file.zip", "file":"attachedfile"},
            {"name": "PROJECT_NAME", "value": autoHostLink},
            {"name": "re_submission", "value": reSubmission},
            {"name": "user_id", "value": userId},
        ]
      };
      const formData = {
        json: JSON.stringify(postData),
        attachedfile: fs.createReadStream(process.cwd() + '/' + filePath),
      };
      LogService.info('Autohost Post Data', formData);
      LogService.info('Autohost Config', autoHostConfig);
      request.post({
          url: autoHostConfig.JENKINS_AUTO_HOST_PATH,
          formData: formData,
          auth: auth
        }, (err, response, body) => {
        if (err || response.statusCode !== 201) {
          LogService.info('Jenkins Autohost Request Failed', { statusCode: response.statusCode, err});
          return reject({ code: code.INTERNAL_SERVER_ERROR, data: {} })
        }
        const challengeData = {
          uid: userId,
          app_name: appName,
          challenge_type: challengeTypeId,
          challenge_name: challengeName,
          challenge_language: language,
          source_type: sourceType,
          source_code: filePath.split('/').pop(),
          host_link: autoHostLink,
          process_id: '', // no idea what this is
          github_link: githubLink,
          estimated_time: estimatedTime,
          send_date: new Date(),
        };
        saveChallengeInfo(challengeData, reSubmission)
        .then(_ => resolve({ code: code.OK, message: '', data: { autoHostLink: autoHostLink } }))
        .catch(err => reject(err))
      });
    }).catch((err) => {
      reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
    }).finally(_ => {
      fs.unlink(autoHostData.filePath, err => {
        if (err){
          LogService.error('Error Occured Unlinking Auohost File', err);
        }
      })
    })
  })
}

/**
 * Function that gets the autohost build status
 *
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   string autohostlink
 * @return  json
 */
function getAutoHostBuildStatus(autoHostLink) {
  return new Promise((resolve, reject) => {
    dashboardModel.getAutoHostBuildStatus(autoHostLink).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get challenge infos
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getCertificationsList(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getCertificationsList(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that gets all skills
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getAllSkillsList(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getAllSkillsList(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves personal info
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  json 
 */
function savePersonalInfo(userInfo) {
  return new Promise((resolve, reject) => {
    dashboardModel.savePersonalInfo(userInfo).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves resume
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  json 
 */
function saveResume(userInfo) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveResume(userInfo).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves the answer file for system design
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  json 
 */
function saveSystemDesign(userInfo) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveSystemDesign(userInfo).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves the answer file for product design
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  json 
 */
function saveProductDesign(userInfo) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveProductDesign(userInfo).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves plains resume
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object plainResumeInfo
 * @return  json 
 */
function savePlainResume(plainResumeInfo) {
  return new Promise((resolve, reject) => {
    dashboardModel.savePlainResume(plainResumeInfo).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves avatar
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  json 
 */
function saveAvatar(userInfo) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveAvatar(userInfo).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that retrieves personal info
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getPersonalInfo(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getPersonalInfo(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves technical skill
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userSkill
 * @return  json 
 */
function saveTechnicalSkill(userSkill) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveTechnicalSkill(userSkill).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that edits technical skill
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userSkill
 * @return  json 
 */
function editTechnicalSkill(userSkill) {
  return new Promise((resolve, reject) => {
    dashboardModel.editTechnicalSkill(userSkill).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that deletes technical skill
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userSkill
 * @return  json 
 */
function deleteTechnicalSkill(userSkill) {
  return new Promise((resolve, reject) => {
    dashboardModel.deleteTechnicalSkill(userSkill).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that retrieves technical skills
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getTechnicalSkills(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getTechnicalSkills(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves user experience
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userExperience
 * @return  json 
 */
function saveExperience(userExperience) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveExperience(userExperience).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that edits technical skill
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userExperience
 * @return  json 
 */
function editExperience(userExperience) {
  return new Promise((resolve, reject) => {
    dashboardModel.editExperience(userExperience).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that deletes technical skill
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userExperience
 * @return  json 
 */
function deleteExperience(userExperience) {
  return new Promise((resolve, reject) => {
    dashboardModel.deleteExperience(userExperience).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that retrieves technical skills
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getUserExperience(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getUserExperience(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves user education
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userEducation
 * @return  json 
 */
function saveEducation(userEducation) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveEducation(userEducation).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that edits education
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userEducation
 * @return  json 
 */
function editEducation(userEducation) {
  return new Promise((resolve, reject) => {
    dashboardModel.editEducation(userEducation).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that deletes user education
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userEducation
 * @return  json 
 */
function deleteEducation(userEducation) {
  return new Promise((resolve, reject) => {
    dashboardModel.deleteEducation(userEducation).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that retrieves user education
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getUserEducation(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getUserEducation(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}


/**
 * Function that saves user certification
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userCertification
 * @return  json 
 */
function saveCertification(userCertification) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveCertification(userCertification).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that edits user certification
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userCertification
 * @return  json 
 */
function editCertification(userCertification) {
  return new Promise((resolve, reject) => {
    dashboardModel.editCertification(userCertification).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that deletes user certification
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userCertification
 * @return  json 
 */
function deleteCertification(userCertification) {
  return new Promise((resolve, reject) => {
    dashboardModel.deleteCertification(userCertification).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that retrieves user certifications
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getUserCertifications(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getUserCertifications(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves user's project
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userProject
 * @return  json 
 */
function saveProject(userProject) {
  return new Promise((resolve, reject) => {
    dashboardModel.saveProject(userProject).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that edits user's project
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userProject
 * @return  json 
 */
function editProject(userProject) {
  return new Promise((resolve, reject) => {
    dashboardModel.editProject(userProject).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that deletes user's project
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userProject
 * @return  json 
 */
function deleteProject(userProject) {
  return new Promise((resolve, reject) => {
    dashboardModel.deleteProject(userProject).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that retrieves user's projects
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getUserProjects(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getUserProjects(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that saves user's publicaion
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userPublication
 * @return  json 
 */
function savePublication(userPublication) {
  return new Promise((resolve, reject) => {
    dashboardModel.savePublication(userPublication).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that edits user's publications 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userPublication
 * @return  json 
 */
function editPublication(userPublication) {
  return new Promise((resolve, reject) => {
    dashboardModel.editPublication(userPublication).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that deletes user's publications
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userPublication
 * @return  json 
 */
function deletePublication(userPublication) {
  return new Promise((resolve, reject) => {
    dashboardModel.deletePublication(userPublication).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that retrieves user's publications
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getUserPublications(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getUserPublications(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that retrieves user's system design
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getUserSystemDesign(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getUserSystemDesign(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that retrieves user's product design
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  json 
 */
function getUserProductDesign(userId) {
  return new Promise((resolve, reject) => {
    dashboardModel.getUserProductDesign(userId).then((data) => {
      resolve({ code: code.OK, message: '', data: data })
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

module.exports = dashboardService
