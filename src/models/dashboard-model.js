/**
 * Dashboard model file
 *
 * @package   backend/src/models
 * @author    YingTuring <ying@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/dashboard/
 */

var db = require('../database/database')
var message = require('../constants/message')
var bcrypt = require('bcrypt-nodejs')
var table = require('../constants/table')
const AutoHostBuildStatusConstants = require('../constants/autohost_status')
var visitModel = require('./visit-model')
const LogService = require('../services/log-service');

var dashboardModel = {
  savePersonalData: savePersonalData,
  saveExpertiseData: saveExpertiseData,
  saveSkillData: saveSkillData,
  changePassword: changePassword,
  getPersonalData: getPersonalData,
  getAccountInfo: getAccountInfo,
  getTestResult: getTestResult,
  deleteAccount: deleteAccount,
  deleteItemSubmitList: deleteItemSubmitList,
  deleteItemSubmitNotification: deleteItemSubmitNotification,
  deleteItemTestList: deleteItemTestList,
  deleteItemFacebookList: deleteItemFacebookList,
  deleteItemGithubList: deleteItemGithubList,
  deleteItemGoolgeList: deleteItemGoolgeList,
  deleteItemLinkedInList: deleteItemLinkedInList,
  getChallengeType: getChallengeType,
  getChallengeInfo: getChallengeInfo,
  saveShowDescriptionTrack: saveShowDescriptionTrack,
  getChallengeAllInfo: getChallengeAllInfo,
  hasAutoHostLinkHasBeenUsed: hasAutoHostLinkHasBeenUsed,
  saveChallengeInfo: saveChallengeInfo,
  getNumberOfHostLinksUsed: getNumberOfHostLinksUsed,
  getPreviousHostLink: getPreviousHostLink,
  saveAutoHostBuildStatus: saveAutoHostBuildStatus,
  getUserDetailsFromId: getUserDetailsFromId,
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
  getUserProductDesign: getUserProductDesign,
  getAutoHostBuildStatus: getAutoHostBuildStatus,
}

/**
 * Function that get personal infos
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function getPersonalData(userId) {
  let query = `SELECT first_name, last_name, country, phone_number, linkedin_url, recent_position, recent_employer, resume_path, job_names, job_levels, skill_names, skill_levels FROM ${table.SUBMIT_LIST} WHERE uid= ?`

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows[0])
        } else {
          reject({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that get account infos
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function getAccountInfo(userId) {
  let emailQuery = `SELECT email, oerror_code, ferror_code, lerror_code, gerror_code FROM ${table.USER_LIST} 
  LEFT JOIN ${table.FACEBOOK_LIST} ON ${table.USER_LIST}.id = ${table.FACEBOOK_LIST}.fuid 
  LEFT JOIN ${table.GOOGLE_LIST} ON ${table.USER_LIST}.id = ${table.GOOGLE_LIST}.ouid 
  LEFT JOIN ${table.LINKEDIN_LIST} ON ${table.USER_LIST}.id = ${table.LINKEDIN_LIST}.luid 
  LEFT JOIN ${table.GITHUB_LIST} ON ${table.USER_LIST}.id = ${table.GITHUB_LIST}.guid 
  WHERE ${table.USER_LIST}.id= ?`

  return new Promise((resolve, reject) => {
    db.query(emailQuery, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows[0])
        } else {
          reject({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that get test result
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function getTestResult(userId) {
  let userOringTestResult = '', userMoreTestResult = '', listMaxTestResult = '', languages = [], listMaxLanguage = []
  let originTestQuery = `SELECT test_user_score_palindrome, test_system_score_palindrome, test_time_palindrome, test_source_path_palindrome,  test_user_score_hackland, test_system_score_hackland, test_time_hackland, test_source_path_hackland, test_language FROM ${table.SUBMIT_LIST} WHERE uid= ?`
  let moreTestQuery = `SELECT test_user_score_palindrome, test_system_score_palindrome, test_time_palindrome, test_source_palindrome,  test_user_score_hackland, test_system_score_hackland, test_time_hackland, test_source_hackland, test_language FROM ${table.TEST_LIST} WHERE uid= ?`
  let listMaxTestQuery = `SELECT test_user_score, test_system_score, test_time, test_source, test_language FROM listmax_test_list_v4 WHERE uid= ?`

  return new Promise((resolve, reject) => {
    db.query(originTestQuery, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          userOringTestResult = rows[0]
          languages.push(rows[0].test_language)
        } else
          reject({ message: message.ACCOUNT_NOT_EXIST })

        db.query(moreTestQuery, [userId], (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
            if (rows.length > 0) {
              userMoreTestResult = rows

              for (let i = 0; i < rows.length; i++)
                languages.push(rows[i].test_language)
            }
          }

          db.query(listMaxTestQuery, [userId], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              if (rows.length > 0) {
                listMaxTestResult = rows
  
                for (let i = 0; i < rows.length; i++)
                  listMaxLanguage.push(rows[i].test_language)
              }

              const data = {
                languages: languages,
                originTest: userOringTestResult,
                moreTest: userMoreTestResult,
                listMaxResult : listMaxTestResult,
                listMaxLanguages : listMaxLanguage
              }
              resolve(data)
            }
          })
        })
      }
    })
  })
}

/**
 * Function that save personal data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object userData
 * @return  object if success returns object else returns message
 */
function savePersonalData(userData) {
  if (userData.resumeFile === '') {
    var query = 'UPDATE ' + table.SUBMIT_LIST + ' SET first_name = ?, last_name = ?, phone_number = ?, country = ?, recent_employer = ?, recent_position = ?, linkedin_url = ? WHERE uid = ?'

    return new Promise((resolve, reject) => {
      db.query(query, [userData.first_name, userData.last_name, userData.phone_number, userData.country, userData.recent_employer, userData.recent_position, userData.linkedin_url, userData.userId], (error, result, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          visitModel.checkVisitSession(db, userData.userId, 0).then((result) =>{
            resolve()
          })
        }
      })
    })
  } else {
    var query = 'UPDATE ' + table.SUBMIT_LIST + ' SET first_name = ?, last_name = ?, phone_number = ?, country = ?, recent_employer = ?, recent_position = ?, linkedin_url = ?, resume_path = ? WHERE uid = ?'

    return new Promise((resolve, reject) => {
      db.query(query, [userData.first_name, userData.last_name, userData.phone_number, userData.country, userData.recent_employer, userData.recent_position, userData.linkedin_url, userData.resumeFile, userData.userId], (error, result, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          visitModel.checkVisitSession(db, userData.userId, 0).then((result) =>{
            resolve()
          })
        }
      })
    })
  }
}

/**
 * Function that save user expertise
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object expertiseData
 * @return  object if success returns object else returns message
 */
function saveExpertiseData(expertiseData) {
  var query = 'UPDATE ' + table.SUBMIT_LIST + ' SET expertise = ? WHERE uid = ?'

  return new Promise((resolve, reject) => {
    db.query(query, [expertiseData.expertise, expertiseData.userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, expertiseData.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that save user skill
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object skillData
 * @return  object if success returns object else returns message
 */
function saveSkillData(skillData) {
  var query = 'UPDATE ' + table.SUBMIT_LIST + ' SET skill = ?, WHERE uid = ?'

  return new Promise((resolve, reject) => {
    db.query(query, [skillData.skill, skillData.userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, skillData.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that change user password
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object passwordData
 * @return  object if success returns object else returns message
 */
function changePassword(passwordData) {
  var selectQuery = 'SELECT * FROM user_list_v4 WHERE id = ?'
  var updateQuery = 'UPDATE user_list_v4 SET password = ? WHERE id = ?'
  var newPwd = bcrypt.hashSync(passwordData.newPwd)

  return new Promise((resolve, reject) => {
    db.query(selectQuery, [passwordData.userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else if (rows.length > 0) {
        if ((rows[0].password != '') && bcrypt.compareSync(passwordData.oldPwd, rows[0].password)) {
          // update 
          db.query(updateQuery, [newPwd, passwordData.userId], (error, result, fields) => {
            if (error)
              reject({ message: message.INTERNAL_SERVER_ERROR })
            else
              resolve()
          })
        } else if ((rows[0].password != '') && !bcrypt.compareSync(passwordData.oldPwd, rows[0].password))
          reject({ message: message.INVALID_OLD_PASSWORD })
        else
          reject({ message: message.CHANGEPWD_ERROR })
      }
    })
  })
}

/**
 * Function that delete from user list
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function deleteAccount(userId) {
  var query = `DELETE FROM ${table.USER_LIST} WHERE ${table.USER_LIST}.id=?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        Promise.all([
          dashboardModel.deleteItemSubmitList(userId),
          dashboardModel.deleteItemSubmitNotification(userId),
          dashboardModel.deleteItemTestList(userId),
          dashboardModel.deleteItemLinkedInList(userId),
          dashboardModel.deleteItemFacebookList(userId),
          dashboardModel.deleteItemGithubList(userId),
          dashboardModel.deleteItemGoolgeList(userId),
        ]).then(() => {
          resolve()
        }).catch((error) => {
          console.log(error)
        })
      }
    })
  })
}

/**
 * Function that delete from submit  list
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function deleteItemSubmitList(userId) {
  var query = `DELETE FROM ${table.SUBMIT_LIST} WHERE ${table.SUBMIT_LIST}.uid=?`

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that delete from submit notification list
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function deleteItemSubmitNotification(userId) {
  var query = `DELETE FROM ${table.SUBMIT_NOTIFICATION} WHERE ${table.SUBMIT_NOTIFICATION}.uid=?`

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that delete from test list
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function deleteItemTestList(userId) {
  var query = `DELETE FROM ${table.TEST_LIST} WHERE ${table.TEST_LIST}.uid=?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that delete from linkedin list
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function deleteItemLinkedInList(userId) {
  var query = `DELETE FROM ${table.LINKEDIN_LIST} WHERE ${table.LINKEDIN_LIST}.luid=?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that delete from google list
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function deleteItemGoolgeList(userId) {
  var query = `DELETE FROM ${table.GOOGLE_LIST} WHERE ${table.GOOGLE_LIST}.ouid=?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that delete from github list
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function deleteItemGithubList(userId) {
  var query = `DELETE FROM ${table.GITHUB_LIST} WHERE ${table.GITHUB_LIST}.guid=?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that delete from facebook list
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function deleteItemFacebookList(userId) {
  var query = `DELETE FROM ${table.FACEBOOK_LIST} WHERE ${table.FACEBOOK_LIST}.fuid=?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that get challenge type
 * @author  YingTuring <ying@turing.com>
 * @return  object if success returns object else returns message
 */
function getChallengeType() {
  var query = `SELECT * FROM ${table.CHALLENGE_TYPE}`
  
  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows)
      }
    })
  })
}

/**
 * Function that get challenge info
 * @author  YingTuring <ying@turing.com>
 * @param   object challengeData
 * @return  object if success returns object else returns message
 */
function getChallengeInfo(challengeData) {
  var query = ''

  if (challengeData.typeName) {
    query = `SELECT challenge_list_v4.*,  ${table.CHALLENGE_TYPE}.challenge_name AS challengeTypeName FROM ${table.CHALLENGE_LIST} LEFT JOIN ${table.CHALLENGE_TYPE} ON ${table.CHALLENGE_TYPE}.id = ${table.CHALLENGE_LIST}.challenge_type WHERE ${table.CHALLENGE_LIST}.uid = ? AND challenge_type_v4.challenge_name = ?`

    return new Promise((resolve, reject) => {
      db.query(query, [challengeData.userId, challengeData.typeName], (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve(rows)
        }
      })
    })
  } else {
    query = `SELECT DISTINCT challenge_type FROM ${table.CHALLENGE_LIST} WHERE ${table.CHALLENGE_LIST}.uid = ?`
    
    return new Promise((resolve, reject) => {
      db.query(query, [challengeData.userId], (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve(rows)
        }
      })
    })
  }
}

function getNumberOfHostLinksUsed() {
  const query = `SELECT count(*) as count FROM ${table.CHALLENGE_LIST} WHERE host_link != ''`;
  return new Promise((resolve, reject) => {
    db.query(query, [], (error, rows) => {
      if (error) {
        return reject({message: message.INTERNAL_SERVER_ERROR});
      }
      return resolve(rows[0].count);
    });
  });
}

function getPreviousHostLink(userId, challengeName, language) {
  const query = `SELECT * FROM ${table.CHALLENGE_LIST} WHERE uid = ? AND challenge_name = ? AND challenge_language = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [userId, challengeName, language], (error, rows, fields) => {
      if (error) {
        LogService.error('Error Occurred Getting Previous Host Link', error);
        return reject({ message: message.INTERNAL_SERVER_ERROR })
      }
      if (rows.length == 0) {
        return resolve(false);
      }
      return resolve(rows[0].host_link);
    });
  })
}

/**
 * Function that saves challenge info
 * @author  YingTuring <ying@turing.com>
 * @param   object challengeInfo
 * @return  object if success returns object else returns message
 */
function saveChallengeInfo(challengeInfo, reSubmission) {
  challengeInfo.build_status = AutoHostBuildStatusConstants.INPROGESS;
  return new Promise((resolve, reject) => {
    if (reSubmission) {
      const query = `UPDATE ${table.CHALLENGE_LIST} SET app_name = ?, challenge_type = ?, challenge_name = ?, challenge_language = ?, source_type = ?, source_code = ?, process_id = ?, github_link = ?, estimated_time = ?, send_date = ?, build_status = ? WHERE host_link = ?`
      db.query(query, [
        challengeInfo.app_name,
        challengeInfo.challenge_type,
        challengeInfo.challenge_name,
        challengeInfo.challenge_language,
        challengeInfo.source_type,
        challengeInfo.source_code,
        challengeInfo.process_id,
        challengeInfo.github_link,
        challengeInfo.estimated_time,
        challengeInfo.send_date,
        challengeInfo.build_status,
        challengeInfo.host_link,
      ], (error, result, fields) => {
        LogService.error('Error Occurred Updating Challenge Info', error);
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve(true)
        }
      })
    } else {
      query = `INSERT INTO ${table.CHALLENGE_LIST} set ? `;
      db.query(query, challengeInfo, (error, result, fields) => {
        if (error) {
          LogService.error('Error Occurred Creating Challenge Info', error);
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve(true)
        }
      });
    }
  })
}


/**
 * Function that save show description track value
 * @author  YingTuring <ying@turing.com>
 * @param   object challengeData
 * @return  object if success returns object else returns message
 */
function saveShowDescriptionTrack(trackData) {
  var query = `SELECT * FROM ${table.SHOWDESCRIPTION_TRACK_LIST} WHERE uid = ? AND challenge_name = ?`

  return new Promise((resolve, reject) => {
    db.query(query, [trackData.userId, trackData.challenge_name], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          query = `UPDATE ${table.SHOWDESCRIPTION_TRACK_LIST} SET clicked = ? WHERE uid = ? AND challenge_name = ?`

          db.query(query, [trackData.value, trackData.userId, trackData.challenge_name], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve()
            }
          })
        } else {
          query = `INSERT INTO ${table.SHOWDESCRIPTION_TRACK_LIST} set ? `

          var data = {
            uid : trackData.userId,
            challenge_name : trackData.challenge_name,
            clicked : trackData.value
          }

          db.query(query, data, (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve()
            }
          })
        }
      }
    })
  })
}

/**
 * Function that get challenge infos
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @param   int challengeType
 * @return  object if success returns object else returns message
 */
function getChallengeAllInfo(userId, challengeType) {
  let query = `SELECT ${table.CHALLENGE_LIST}.*, ${table.CHALLENGE_LIST}.challenge_name As challenge_sub_name, ${table.CHALLENGE_TYPE}.challenge_name, ${table.SUBMIT_LIST}.first_name, ${table.SUBMIT_LIST}.last_name, ${table.SUBMIT_LIST}.email, ${table.SUBMIT_LIST}.user_country 
  FROM ${table.CHALLENGE_LIST} 
  LEFT JOIN ${table.SUBMIT_LIST} ON ${table.SUBMIT_LIST}.uid = ${table.CHALLENGE_LIST}.uid 
  LEFT JOIN ${table.CHALLENGE_TYPE} ON ${table.CHALLENGE_TYPE}.id = ${table.CHALLENGE_LIST}.challenge_type
  WHERE ${table.SUBMIT_LIST}.uid = ${userId} AND ${table.CHALLENGE_TYPE}.id = ${challengeType}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows[0])
        }
        reject({ message: message.DATA_NOT_EXIST })
      }
    })
  })
}

/**
 * Function that checks if an autohost link has been used
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   autoHostLink   the auto host link we want tot check
 * @return  a promise that resolves to a boolean in the case that there is no error
 */
function hasAutoHostLinkHasBeenUsed(autoHostLink) {
  const query = `SELECT count(*) as count FROM ${table.CHALLENGE_LIST} WHERE ${table.CHALLENGE_LIST}.host_link = ?`

  return new Promise((resolve, reject) => {
    db.query(query, [autoHostLink], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows[0].count > 0)
      }
    })
  })
}

/**
 * Function that checks the build status of autohost
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   autoHostLink   the auto host link we want to check
 * @return  a promise that resolves the status
 */
function getAutoHostBuildStatus(autoHostLink) {
  const query = `SELECT build_status FROM ${table.CHALLENGE_LIST} WHERE ${table.CHALLENGE_LIST}.host_link = ?`

  return new Promise((resolve, reject) => {
    db.query(query, [autoHostLink], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows[0].build_status)
      }
    })
  })
}

/**
 * Get User's Detail From Id
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   id   User's ID
 * @return  a promise that resolves the user's details
 */
function getUserDetailsFromId(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'
    db.query(query, [id], (error, rows, fields) => {
      if (error) {
        LogService.error('Error Occurred Getting User Details From ID', error);
        return reject({ message: message.INTERNAL_SERVER_ERROR })
      }
      if (rows.length === 0) {
        LogService.error('No User Details From Id', error)
        return reject({ message: message.ACCOUNT_NOT_EXIST })
      }
      resolve(rows[0]);
    })
  })
}

/**
 * Function that saves auto host build status
 * @author  FrederickTuring <frederick.a@turing.com>
 * @param   autoHostLink   the auto host link we want tot check
 * @return  a promise that resolves to a boolean in the case that there is no error
 */
function saveAutoHostBuildStatus(autoHostLink) {
  return new Promise((resolve, reject) => {
    const {buildStatus, hostLink} = autoHostLink;
    const query = `UPDATE ${table.CHALLENGE_LIST} SET build_status = ? WHERE host_link = ?`
    db.query(query, [
      buildStatus,
      hostLink,
    ], (error, result, fields) => {
      if (error) {
        LogService.error('Error Occurred Saving Autohost Build Status', error);
        return reject({ message: message.INTERNAL_SERVER_ERROR })
      }
      resolve(true)
    })
  })
}

/**
 * Function that get challenge type
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getCertificationsList(userId) {
  var query = `SELECT * FROM ${table.CERTIFICATIONS} WHERE created_by = -1 OR created_by = ? ORDER BY name`
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows)
      }
    })
  })
}

/**
 * Function that get all skills list
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getAllSkillsList(userId) {
  var query = `SELECT * FROM ${table.BASE_ALL_SKILLS} WHERE created_by = -1 OR created_by = ? ORDER BY skill_name`
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows)
      }
    })
  })
}

/**
 * Function that get challenge type
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  object if success returns object else returns message
 */
function savePersonalInfo(userInfo) {
  var query = `SELECT * FROM ${table.DEVELOPER_DETAIL} WHERE user_id = ?`
  return new Promise((resolve, reject) => {
    db.query(query, [userInfo.developer_id], async (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if(rows.length === 0) {
          let developerDetail = {
            user_id: userInfo.developer_id,
            role: userInfo.role,
            country: userInfo.country,
            years_of_experience: userInfo.years_of_experience,
            years_of_working_remotely: userInfo.years_of_working_remotely
          }
          let workingHours = {
            developer_id: userInfo.developer_id,
            time_from: userInfo.working_hours_start,
            time_to: userInfo.working_hours_end
          }
          let insertQuery1 = `INSERT INTO ${table.DEVELOPER_DETAIL} set ?`
          let insertQuery2 = `INSERT INTO ${table.TPM_DEVELOPER_WORKING_HOURS} set ?`
          let phoneUpdate = `UPDATE ${table.SUBMIT_LIST} set phone_number = ? WHERE uid = ?`
          let nameUpdate = `UPDATE ${table.USER_LIST} set full_name = ? WHERE id = ?`
          await db.query(phoneUpdate, [userInfo.phone_number, userInfo.developer_id], (error, rows, fields) => {});
          await db.query(nameUpdate, [userInfo.full_name, userInfo.developer_id], (error, rows, fields) => {});
          await db.query(insertQuery1, developerDetail, (error, rows, fields) => {});
          db.query(insertQuery2, workingHours, (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        } else {
          const {
            working_hours_start: timeFrom,
            working_hours_end: timeTo,
            developer_id: devId,
            phone_number: phoneNumber,
            full_name: fullName,
            role,
            country,
            years_of_experience: yearsOfExperience,
            years_of_working_remotely: yearsOfWorkingRemotely,
          } = userInfo
          var updateQuery1 = `UPDATE ${table.DEVELOPER_DETAIL} set role = ?, country = ?, years_of_experience = ?, years_of_working_remotely = ? WHERE user_id = ?`
          var updateQuery2 = `INSERT INTO ${table.TPM_DEVELOPER_WORKING_HOURS} (id, time_from, time_to, developer_id) SELECT (SELECT id FROM ${table.TPM_DEVELOPER_WORKING_HOURS} WHERE developer_id = ?), ?, ?, ? ON DUPLICATE KEY UPDATE time_from = ?, time_to = ?`
          let phoneUpdate = `UPDATE ${table.SUBMIT_LIST} set phone_number = ? WHERE uid = ?` 
          let nameUpdate = `UPDATE ${table.USER_LIST} set full_name = ? WHERE id = ?`

          await db.query(phoneUpdate, [phoneNumber, devId], (error, rows, fields) => {});
          await db.query(nameUpdate, [fullName, devId], (error, rows, fields) => {});
          await db.query(updateQuery1, [role, country, yearsOfExperience, yearsOfWorkingRemotely, devId], (error, rows, fields) => {});
          db.query(updateQuery2, [devId, timeFrom, timeTo, devId, timeFrom, timeTo], (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        }
      }
    })
  })
}

/**
 * Function that saves resume
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  object if success returns object else returns message
 */
function saveResume(userInfo) {
  var query = `SELECT * FROM ${table.DEVELOPER_DETAIL} WHERE user_id = ?`
  return new Promise((resolve, reject) => {
    db.query(query, [userInfo.developer_id], async (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let devInfo = {
          user_id: userInfo.developer_id,
          resume: userInfo.resume
        }
        if(rows.length === 0) {
          let insertQuery = `INSERT INTO ${table.DEVELOPER_DETAIL} set ?`
          db.query(insertQuery, devInfo, (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        } else {
          var updateQuery = `UPDATE ${table.DEVELOPER_DETAIL} set resume = ? WHERE user_id = ?`
          db.query(updateQuery, [userInfo.resume, userInfo.developer_id], (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        }
      }
    })
  })
}

/**
 * Function that saves the answer file for system design
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  object if success returns object else returns message
 */
function saveSystemDesign(userInfo) {
  var query = `SELECT * FROM ${table.DEVELOPER_SYSTEM_DESIGN} WHERE developer_id = ?`
  return new Promise((resolve, reject) => {
    db.query(query, [userInfo.developer_id], async (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let devInfo = {
          developer_id: userInfo.developer_id,
          answer_file: userInfo.answer_file
        }
        if(rows.length === 0) {
          let insertQuery = `INSERT INTO ${table.DEVELOPER_SYSTEM_DESIGN} set ?`
          db.query(insertQuery, devInfo, (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        } else {
          var updateQuery = `UPDATE ${table.DEVELOPER_SYSTEM_DESIGN} set answer_file = ? WHERE developer_id = ?`
          db.query(updateQuery, [userInfo.answer_file, userInfo.developer_id], (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        }
      }
    })
  })
}

/**
 * Function that saves the answer file for product design
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  object if success returns object else returns message
 */
function saveProductDesign(userInfo) {
  var query = `SELECT * FROM ${table.DEVELOPER_PRODUCT_DESIGN} WHERE developer_id = ?`
  return new Promise((resolve, reject) => {
    db.query(query, [userInfo.developer_id], async (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let devInfo = {
          developer_id: userInfo.developer_id,
          answer_file: userInfo.answer_file
        }
        if(rows.length === 0) {
          let insertQuery = `INSERT INTO ${table.DEVELOPER_PRODUCT_DESIGN} set ?`
          db.query(insertQuery, devInfo, (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        } else {
          var updateQuery = `UPDATE ${table.DEVELOPER_PRODUCT_DESIGN} set answer_file = ? WHERE developer_id = ?`
          db.query(updateQuery, [userInfo.answer_file, userInfo.developer_id], (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        }
      }
    })
  })
}

/**
 * Function that saves plain resume
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object plainResumeInfo
 * @return  object if success returns object else returns message
 */
function savePlainResume(plainResumeInfo) {
  var query = `SELECT * FROM ${table.DEVELOPER_DETAIL} WHERE user_id = ?`
  return new Promise((resolve, reject) => {
    db.query(query, [plainResumeInfo.developer_id], async (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let devInfo = {
          user_id: plainResumeInfo.developer_id,
          resume_plain: plainResumeInfo.resume_plain
        }
        if(rows.length === 0) {
          let insertQuery = `INSERT INTO ${table.DEVELOPER_DETAIL} set ?`
          db.query(insertQuery, devInfo, (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        } else {
          var updateQuery = `UPDATE ${table.DEVELOPER_DETAIL} set resume_plain = ? WHERE user_id = ?`
          db.query(updateQuery, [plainResumeInfo.resume_plain, plainResumeInfo.developer_id], (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        }
      }
    })
  })
}

/**
 * Function that saves avatar
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userInfo
 * @return  object if success returns object else returns message
 */
function saveAvatar(userInfo) {
  var query = `SELECT * FROM ${table.DEVELOPER_DETAIL} WHERE user_id = ?`
  return new Promise((resolve, reject) => {
    db.query(query, [userInfo.developer_id], async (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let devInfo = {
          user_id: userInfo.developer_id,
          avatar: userInfo.avatar
        }
        if(rows.length === 0) {
          let insertQuery = `INSERT INTO ${table.DEVELOPER_DETAIL} set ?`
          db.query(insertQuery, devInfo, (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        } else {
          var updateQuery = `UPDATE ${table.DEVELOPER_DETAIL} set avatar = ? WHERE user_id = ?`
          db.query(updateQuery, [userInfo.avatar, userInfo.developer_id], (error, rows, fields) => {
            if(!error) {
              resolve(true)
            } else {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            }
          });
        }
      }
    })
  })
}

/**
 * Function that retrieves user experience
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getPersonalInfo(userId) {
  var query = `SELECT ${table.SUBMIT_LIST}.phone_number, ${table.USER_LIST}.full_name, ${table.DEVELOPER_DETAIL}.resume, ${table.DEVELOPER_DETAIL}.avatar, ${table.USER_LIST}.email, ${table.DEVELOPER_DETAIL}.country, ${table.DEVELOPER_DETAIL}.role, ${table.DEVELOPER_DETAIL}.years_of_experience, ${table.DEVELOPER_DETAIL}.years_of_working_remotely, ${table.TPM_DEVELOPER_WORKING_HOURS}.time_from, ${table.TPM_DEVELOPER_WORKING_HOURS}.time_to  FROM ${table.SUBMIT_LIST} LEFT JOIN ${table.USER_LIST} ON ${table.SUBMIT_LIST}.uid = ${table.USER_LIST}.id LEFT JOIN ${table.DEVELOPER_DETAIL} ON ${table.USER_LIST}.id = ${table.DEVELOPER_DETAIL}.user_id LEFT JOIN ${table.TPM_DEVELOPER_WORKING_HOURS} ON ${table.USER_LIST}.id = ${table.TPM_DEVELOPER_WORKING_HOURS}.developer_id  WHERE ${table.USER_LIST}.id = ? `
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if(rows.length > 0) {
          let row = rows[0];
          {
            let response = {
              full_name: row.full_name,
              avatar_url: row.avatar,
              email: row.email,
              phone_number: row.phone_number,
              country: row.country,
              working_start_time: row.time_from,
              working_end_time: row.time_to,
              preferred_stack: row.role,
              years_of_experience: row.years_of_experience,
              years_of_working_remotely: row.years_of_working_remotely,
              resume: row.resume
            }
            resolve(response)
          }
        } else {
          reject({ message: message.DATA_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that saves technical Skill
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userSkill
 * @return  object if success returns object else returns message
 */
function saveTechnicalSkill(userSkill) {
  if (isNaN(userSkill.skill_id) && userSkill.skill_id !== ''){
    let skill = {
      skill_name: userSkill.skill_id,
      skill_count: 0,
      demand_scale: 0,
      skill_type_id: 16,
      created_by: userSkill.developer_id
    }
    let query = `INSERT INTO ${table.BASE_ALL_SKILLS} set ?`
    return new Promise((resolve, reject) => {
      db.query(query, skill, (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          userSkill.skill_id = rows.insertId;
          query = `INSERT INTO ${table.DEVELOPER_SKILLS} set ?`
          db.query(query, userSkill, (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve({id: rows.insertId})
            }
          })
        }
      })
    })
  } else {
    let query = `INSERT INTO ${table.DEVELOPER_SKILLS} set ?`
    return new Promise((resolve, reject) => {
      db.query(query, userSkill, (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve({id: rows.insertId})
        }
      })
    })
  }
}

/**
 * Function that edits technical Skill
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userSkill
 * @return  object if success returns object else returns message
 */
function editTechnicalSkill(userSkill) {
  if (isNaN(userSkill.skill_id) && userSkill.skill_id !== ''){
    let skill = {
      skill_name: userSkill.skill_id,
      skill_count: 0,
      demand_scale: 0,
      skill_type_id: 16,
      created_by: userSkill.developer_id
    }
    let query = `INSERT INTO ${table.BASE_ALL_SKILLS} set ?`
    return new Promise((resolve, reject) => {
      db.query(query, skill, (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          userSkill.skill_id = rows.insertId;
          query = `UPDATE ${table.DEVELOPER_SKILLS} set skill_id = ?, score = ? WHERE id = ? AND developer_id = ?`
          db.query(query, [userSkill.skill_id, userSkill.score, userSkill.id, userSkill.developer_id], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve({id: rows.insertId})
            }
          })
        }
      })
    })
  } else {
    let query = `UPDATE ${table.DEVELOPER_SKILLS} set skill_id = ?, score = ? WHERE id = ? AND developer_id = ?`
    return new Promise((resolve, reject) => {
      db.query(query, [userSkill.skill_id, userSkill.score, userSkill.id, userSkill.developer_id], (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve(true)
        }
      })
    })
  }
}

/**
 * Function that deletes technical Skill
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userSkill
 * @return  object if success returns object else returns message
 */
function deleteTechnicalSkill(userSkill) {
  var query = `DELETE FROM ${table.DEVELOPER_SKILLS} WHERE id = ? AND developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userSkill.id, userSkill.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that retrieves technical Skill
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getTechnicalSkills(userId) {
  var query = `SELECT ${table.DEVELOPER_SKILLS}.*, ${table.BASE_ALL_SKILLS}.skill_name FROM ${table.DEVELOPER_SKILLS} JOIN ${table.BASE_ALL_SKILLS} ON ${table.DEVELOPER_SKILLS}.skill_id = ${table.BASE_ALL_SKILLS}.id WHERE developer_id = ? ORDER BY score DESC`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows)
      }
    })
  })
}

/**
 * Function that saves user experience
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userExperience
 * @return  object if success returns object else returns message
 */
function saveExperience(userExperience) {
  var query = `INSERT INTO ${table.DEVELOPER_EXPERIENCE} set ?`
  return new Promise((resolve, reject) => {
    db.query(query, userExperience, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve({id: rows.insertId})
      }
    })
  })
}

/**
 * Function that edits user experience
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userExperience
 * @return  object if success returns object else returns message
 */
function editExperience(userExperience) {

  var query = `UPDATE ${table.DEVELOPER_EXPERIENCE} set position = ?, company = ?, start_year = ?, start_month = ?, end_year = ?, end_month = ?, details = ?, url = ? WHERE id = ? AND developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userExperience.position, userExperience.company, userExperience.start_year, userExperience.start_month, userExperience.end_year, userExperience.end_month, userExperience.details, userExperience.url, userExperience.id, userExperience.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that deletes user experience
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userExperience
 * @return  object if success returns object else returns message
 */
function deleteExperience(userExperience) {
  var query = `DELETE FROM ${table.DEVELOPER_EXPERIENCE} WHERE id = ? AND developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userExperience.id, userExperience.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that retrieves user experience
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getUserExperience(userId) {
  var query = `SELECT * FROM ${table.DEVELOPER_EXPERIENCE} WHERE developer_id = ? ORDER BY end_year DESC`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows)
      }
    })
  })
}

/**
 * Function that saves user education
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userEducation
 * @return  object if success returns object else returns message
 */
function saveEducation(userEducation) {
  var query = `INSERT INTO ${table.DEVELOPER_EDUCATION} set ?`
  return new Promise((resolve, reject) => {
    db.query(query, userEducation, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve({id: rows.insertId})
      }
    })
  })
}


/**
 * Function that edits user education
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userEducation
 * @return  object if success returns object else returns message
 */
function editEducation(userEducation) {

  var query = `UPDATE ${table.DEVELOPER_EDUCATION} set degree = ?, college = ?, start_year = ?, start_month = ?, end_year = ?, end_month = ? WHERE id = ? AND developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userEducation.degree, userEducation.college, userEducation.start_year, userEducation.start_month, userEducation.end_year, userEducation.end_month, userEducation.id, userEducation.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that deletes user education
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userExperience
 * @return  object if success returns object else returns message
 */
function deleteEducation(userEducation) {
  var query = `DELETE FROM ${table.DEVELOPER_EDUCATION} WHERE id = ? AND developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userEducation.id, userEducation.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that retrieves user education
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getUserEducation(userId) {
  var query = `SELECT * FROM ${table.DEVELOPER_EDUCATION} WHERE developer_id = ? ORDER BY end_year DESC`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows)
      }
    })
  })
}


/**
 * Function that saves user certification
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userCertification
 * @return  object if success returns object else returns message
 */
function saveCertification(userCertification) {
  if (isNaN(userCertification.certification_id) && userCertification.certification_id !== ''){
    let certification = {
      name: userCertification.certification_id,
      description: '',
      logo_url: '',
      created_by: userCertification.developer_id
    }
    let query = `INSERT INTO ${table.CERTIFICATIONS} set ?`
    return new Promise((resolve, reject) => {
      db.query(query, certification, (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          userCertification.certification_id = rows.insertId;
          query = `INSERT INTO ${table.DEVELOPER_CERTIFICATION} set ?`
          db.query(query, userCertification, (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve({id: rows.insertId})
            }
          })
        }
      })
    })
  } else {
    let query = `INSERT INTO ${table.DEVELOPER_CERTIFICATION} set ?`
    return new Promise((resolve, reject) => {
      db.query(query, userCertification, (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve({id: rows.insertId})
        }
      })
    })
  }
}

/**
 * Function that edits user certification
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userCertification
 * @return  object if success returns object else returns message
 */
function editCertification(userCertification) {
  if (isNaN(userCertification.certification_id) && userCertification.certification_id !== ''){
    let certification = {
      name: userCertification.certification_id,
      description: '',
      logo_url: '',
      created_by: userCertification.developer_id
    }
    let query = `INSERT INTO ${table.CERTIFICATIONS} set ?`
    return new Promise((resolve, reject) => {
      db.query(query, certification, (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          userCertification.certification_id = rows.insertId;
          query = `UPDATE ${table.DEVELOPER_CERTIFICATION} set certification_id = ?, year = ? WHERE id = ? AND developer_id = ?`
          db.query(query, [userCertification.certification_id, userCertification.year, userCertification.id, userCertification.developer_id], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve({id: rows.insertId})
            }
          })
        }
      })
    })
  } else {
    var query = `UPDATE ${table.DEVELOPER_CERTIFICATION} set certification_id = ?, year = ? WHERE id = ? AND developer_id = ?`
    return new Promise((resolve, reject) => {
      db.query(query, [userCertification.certification_id, userCertification.year, userCertification.id, userCertification.developer_id], (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve(true)
        }
      })
    })
  }
}

/**
 * Function that deletes user certification
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userCertification
 * @return  object if success returns object else returns message
 */
function deleteCertification(userCertification) {
  var query = `DELETE FROM ${table.DEVELOPER_CERTIFICATION} WHERE id = ? AND developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userCertification.id, userCertification.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that retrieves user certification
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getUserCertifications(userId) {
  var query = `SELECT ${table.DEVELOPER_CERTIFICATION}.*, ${table.CERTIFICATIONS}.name FROM ${table.DEVELOPER_CERTIFICATION} JOIN ${table.CERTIFICATIONS} ON ${table.DEVELOPER_CERTIFICATION}.certification_id = ${table.CERTIFICATIONS}.id WHERE developer_id = ? ORDER BY year DESC`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows)
      }
    })
  })
}


/**
 * Function that saves user project
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userProject
 * @return  object if success returns object else returns message
 */
function saveProject(userProject) {
  var query = `INSERT INTO ${table.DEVELOPER_PROJECT} set ?`
  return new Promise((resolve, reject) => {
    db.query(query, userProject, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve({id: rows.insertId})
      }
    })
  })
}

/**
 * Function that edits user project
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userProject
 * @return  object if success returns object else returns message
 */
function editProject(userProject) {

  var query = `UPDATE ${table.DEVELOPER_PROJECT} set project_name = ?, start_year = ?, start_month = ?, end_year = ?, end_month = ?, details = ?, url = ? WHERE id = ? AND developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userProject.project_name, userProject.start_year, userProject.start_month, userProject.end_year, userProject.end_month, userProject.details, userProject.url, userProject.id, userProject.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that deletes user project
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userProject
 * @return  object if success returns object else returns message
 */
function deleteProject(userProject) {
  var query = `DELETE FROM ${table.DEVELOPER_PROJECT} WHERE id = ? AND developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userProject.id, userProject.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that retrieves user's projects
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getUserProjects(userId) {
  var query = `SELECT * FROM ${table.DEVELOPER_PROJECT} WHERE developer_id = ? ORDER BY end_year DESC`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows)
      }
    })
  })
}

/**
 * Function that saves user publication
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userPublication
 * @return  object if success returns object else returns message
 */
function savePublication(userPublication) {
  var query = `INSERT INTO ${table.DEVELOPER_PUBLICATION} set ?`
  return new Promise((resolve, reject) => {
    db.query(query, userPublication, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve({id: rows.insertId})
      }
    })
  })
}

/**
 * Function that edits user publication
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userPublication
 * @return  object if success returns object else returns message
 */
function editPublication(userPublication) {

  var query = `UPDATE ${table.DEVELOPER_PUBLICATION} set title = ?, year = ?, link = ? WHERE id = ? AND developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userPublication.title, userPublication.year, userPublication.link, userPublication.id, userPublication.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that deletes user publication 
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object userPublication
 * @return  object if success returns object else returns message
 */
function deletePublication(userPublication) {
  var query = `DELETE FROM ${table.DEVELOPER_PUBLICATION} WHERE id = ? AND developer_id = ?`
  return new Promise((resolve, reject) => {
    db.query(query, [userPublication.id, userPublication.developer_id], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that retrieves user's publication 
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getUserPublications(userId) {
  var query = `SELECT * FROM ${table.DEVELOPER_PUBLICATION} WHERE developer_id = ? ORDER BY year DESC`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve(rows)
      }
    })
  })
}

/**
 * Function that retrieves user's system design 
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getUserSystemDesign(userId) {
  var query = `SELECT * FROM ${table.DEVELOPER_SYSTEM_DESIGN} WHERE developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          let row = rows[0];
          {
            let response = {
              developer_id: userId,
              answer_file: row.answer_file
            }
            resolve(response)
          }
        } else {
          reject({ message: message.DATA_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that retrieves user's product design 
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   number userId
 * @return  object if success returns object else returns message
 */
function getUserProductDesign(userId) {
  var query = `SELECT * FROM ${table.DEVELOPER_PRODUCT_DESIGN} WHERE developer_id = ?`
  
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          let row = rows[0];
          {
            let response = {
              developer_id: userId,
              answer_file: row.answer_file
            }
            resolve(response)
          }
        } else {
          reject({ message: message.DATA_NOT_EXIST })
        }
      }
    })
  })
}

module.exports = dashboardModel
