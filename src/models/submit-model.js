/**
 * Submit flow model file
 *
 * @package   backend/src/models
 * @author    YingTuring <ying@turing.com>
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/submit/
 */

var db = require('../database/database')
var message  = require('../constants/message')
var api  = require('../constants/api')
var linkedin = require('node-linkedin')(api.LINKEDIN_CLIENT_ID, api.LINKEDIN_CLIENT_SECRET)
var table  = require('../constants/table')
var visitModel = require('./visit-model')

var submitModel = {
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
  getAllInfos: getAllInfos,
  getSelectedLanguageInfo: getSelectedLanguageInfo,
  unlockChallenge: unlockChallenge,
  saveChallengeType: saveChallengeType,
  saveSendEmailChallengeDate: saveSendEmailChallengeDate,
  saveUserExperience: saveUserExperience
}

/**
 * Function that get resume page data
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function getResumeInfo(userId) {
  var query = 'SELECT * FROM submit_list_v4 WHERE uid = ?'

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
 * Function that save resume page data automatically 
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object flowData
 * @return  object if success returns object else returns message
 */
function saveResumeInfo(flowData) {
  var query = 'UPDATE submit_list_v4 SET ' + flowData.fieldName + '= ? WHERE uid = ?'

  return new Promise((resolve, reject) => {
    db.query(query, [flowData.inputValue, flowData.userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, flowData.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that save resume file
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object resumeData
 * @return  object if success returns object else returns message
 */
function saveResume(resumeData) {
  var query = 'UPDATE submit_list_v4 SET resume_path = ? WHERE uid = ?'

  return new Promise((resolve, reject) => {
    db.query(query, [resumeData.resumeFile, resumeData.userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, resumeData.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that authenticates linkedin
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  object if success returns object else returns message
 */
function linkedinOAuth(callback) {
  return new Promise((resolve, reject) => {
    linkedin.setCallback(callback)
    var scope = ['r_basicprofile', 'r_emailaddress']
    linkedin.auth.authorize(res, scope)

    resolve()
  })
}

/**
 * Function that calls linkedin callback
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  object if success returns object else returns message
 */
function linkedinCallback(req, res) {
  return new Promise((resolve, reject) => {
    resolve()

    Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, function(err, results) {
      if (err)
        reject({ message: message.INTERNAL_SERVER_ERROR })

      let linkedinIns = linkedin.init(results.access_token)

      linkedinIns.people.me(function(err, $in) {
        let emailAddress = $in.emailAddress || ''
        let firstName = $in.firstName || ''
        let lastName = $in.lastName || ''
        let id = $in.id || ''
        let headline = $in.headline || ''
        let industry = $in.industry || ''
        let location = $in.location.name || ''
        let country_code = $in.location.country.code || ''
        let numConnections = $in.numConnections || ''
        let numConnectionsCapped = $in.numConnectionsCapped || ''
        let positions = $in.positions || ''
        let company = $in.positions.values[0].company.name || ''
        let role = $in.positions.values[0].title || ''
        let month = $in.positions.values[0].startDate.month || ''
        let year = $in.positions.values[0].startDate.year || ''
        let startDate = (year === '' || month === '') ? '' : month + '/' + year
        let publicProfileUrl = $in.publicProfileUrl || ''
        let pictureUrl = $in.pictureUrl || ''
        let summary = $in.summary || ''
        let userId = 213

        req.getConnection(function(err, connection){
          var data = {
            lsid : userId,
            lfirst_name : firstName,
            llast_name : lastName,
            luser_id : id,
            lemail : emailAddress,
            lprofile_link : publicProfileUrl,
            lheadline : headline,
            lsummary : summary,
            llocation : location,
            lcountry_code : country_code,
            lindustry : industry,
            lconnections : numConnections,
            lcompany : company,
            lrole : role,
            lstart_date : startDate,
            lavata_url : pictureUrl,
            lerror_code : 'success'
          }

          var query = connection.query("INSERT INTO linkedin_list_v4 set ? ", data, function(err, rows)
          {
            if (err)
              reject({ message: message.INTERNAL_SERVER_ERROR })
          })
        })
      })
    })

    return res.redirect('/')
  })
}

/**
 * Function that save remote experience info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  object  if success returns object else returns message
 */
function saveRemoteExpInfo(data) {
  let query = `UPDATE ${table.SUBMIT_LIST} 
    SET remote_hour="${data.rhValue}", remote_position="${data.rpValue}", remote_custom="${data.rcValue}", remote_home="${data.hcValue}"  
    WHERE uid=${data.userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, data.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that save remote experience info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   int     userId
 * @return  object  if success returns object else returns message
 */
function getRemoteExpInfo(userId) {
  let query = `SELECT remote_hour, remote_position, remote_custom, remote_home FROM ${table.SUBMIT_LIST} WHERE uid=${userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows[0])
        } else {
          reject({ message: message.DATA_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that save profile info 
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  object  if success returns object else returns message
 */
function saveProfileInfo(data) {
  let query = `UPDATE ${table.SUBMIT_LIST} 
    SET first_name="${data.firstName}", last_name="${data.lastName}", phone_number="${data.phoneNumber}" 
    WHERE uid=${data.userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, data.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that fetch profile info 
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   int     userId
 * @return  object  if success returns object else returns message
 */
function getProfileInfo(userId) {
  let query = `SELECT first_name, last_name, phone_number FROM ${table.SUBMIT_LIST} WHERE uid=${userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows[0])
        } else {
          reject({ message: message.DATA_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that save not developer profile info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  object  if success returns object else returns message
 */
function saveNotdevProfileInfo(data) {
  let query = `UPDATE ${table.SUBMIT_LIST} 
    SET profession="${data.profession}", linkedin_url="${data.linkedinUrl}", resume_path="${data.resumePath}" 
    WHERE uid=${data.userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, data.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that fetch not developer profile info 
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   int     userId
 * @return  object  if success returns object else returns message
 */
function getNotdevProfileInfo(userId) {
  let query = `SELECT profession, linkedin_url, resume_path FROM ${table.SUBMIT_LIST} WHERE uid=${userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows[0])
        } else {
          reject({ message: message.DATA_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that save jobs and levels
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  object  if success returns object else returns message
 */
function saveJobsInfo(data) {
  let query = `UPDATE ${table.SUBMIT_LIST} 
    SET job_names="${data.jobList}", job_levels="${data.levelList}" 
    WHERE uid=${data.userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, data.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that get jobs and skills info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   int     userId
 * @return  object  if success returns object else returns message
 */
function getJobsSkillsInfo(userId) {
  let query = `SELECT job_names, job_levels, skill_names, skill_levels FROM ${table.SUBMIT_LIST} WHERE uid=${userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows[0])
        } else {
          resolve({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that save skills and levels
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  data
 * @return  object  if success returns object else returns message
 */
function saveSkillsInfo(data) {
  var query = `UPDATE ${table.SUBMIT_LIST} 
    SET skill_names="${data.skillList}", skill_levels="${data.levelList}" 
    WHERE uid=${data.userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, data.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that base get jobs info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  object if success returns object else returns message
 */
function getBaseJobsInfo() {
  let query = `SELECT * FROM ${table.BASE_JOBS} ORDER BY job_count DESC`

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows)
        } else {
          reject({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that get base skills info
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  object if success returns object else returns message
 */
function getBaseSkillsInfo(userId) {
  let query = `SELECT job_names, job_levels FROM ${table.SUBMIT_LIST} WHERE uid=${userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          const jobs = rows[0].job_names.split(',')
          const levels = rows[0].job_levels.split(',')
          let whereQuery = ''
          for (let i = 0; i < jobs.length; i ++ ) {
            if (parseInt(levels[i]) > 2) {
              whereQuery += whereQuery === '' ? '' : ' OR '
              whereQuery += `${table.BASE_JOBS}.job_name="${jobs[i]}"`
            }
          }
          let query = `SELECT ${table.BASE_SKILLS}.skill_name 
            FROM ${table.BASE_JOBS} 
            LEFT JOIN ${table.BASE_SKILLS} ON ${table.BASE_JOBS}.jid = ${table.BASE_SKILLS}.job_id 
            WHERE ${whereQuery}  
            GROUP BY ${table.BASE_SKILLS}.skill_name 
            ORDER BY ${table.BASE_SKILLS}.skill_count DESC`

          if ( whereQuery === '') {
            query = `SELECT ${table.BASE_SKILLS}.skill_name 
            FROM ${table.BASE_JOBS} 
            LEFT JOIN ${table.BASE_SKILLS} ON ${table.BASE_JOBS}.jid = ${table.BASE_SKILLS}.job_id 
            GROUP BY ${table.BASE_SKILLS}.skill_name 
            ORDER BY ${table.BASE_SKILLS}.skill_count DESC`
          }

          db.query(query, (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(rows)  
            }
          })
        } else {
          resolve({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that get base all skills info for auto-completed
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   
 * @return  object if success returns object else returns message
 */
function getBaseAllSkillsInfo() {
  let query = `SELECT skill_name as label FROM ${table.BASE_ALL_SKILLS}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows)  
        } else {
          reject({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that get all submit table info 
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int     userId
 * @return  object  if success returns object else returns message
 */
function getAllInfos(userId) {
  let query = `SELECT * FROM ${table.SUBMIT_LIST} WHERE uid=${userId}`

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows[0])
        } else {
          reject({ message: message.DATA_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that save taking home challenge option
 *
 * @author  YingTuring <ying@turing.com>
 * @param   object  data
 * @return  object  if success returns object else returns message
 */
function saveHomeChallengeOption(data) {
  let query = `UPDATE ${table.SUBMIT_LIST} SET take_challenge_type="${data.option}" WHERE uid= ?`

  return new Promise((resolve, reject) => {
    db.query(query, [data.userId], (error, result, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        visitModel.checkVisitSession(db, data.userId, 0).then((result) =>{
          resolve()
        })
      }
    })
  })
}

/**
 * Function that get selected language
 *
 * @author  DongTuring <dong@turing.com>
 * @param   int  userId
 * @return  object if success returns object else returns message
 */
function getSelectedLanguageInfo(userId) {
  let query = 'SELECT test_language FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          resolve(rows[0].test_language)
        } else {
          reject({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Function that unlock challenges
 *
 * @author  YingTuring <ying@turing.com>
 * @param   int  userId
 * @return  object  if success returns object else returns message
 */
function unlockChallenge(userId) {
  return new Promise((resolve, reject) => {
    submitModel.saveChallengeType(userId, 1, '', 0).then(() => {
      submitModel.saveChallengeType(userId, 2, '', 0).then(() => {
        submitModel.saveChallengeType(userId, 2, '', 1).then(() => {
          submitModel.saveChallengeType(userId, 3, '', 1).then(() => {
            submitModel.saveChallengeType(userId, 4, '', -1).then(() => {
              submitModel.saveChallengeType(userId, 5, '', 2).then(() => {
                submitModel.saveChallengeType(userId, 6, '', 0).then(() => {
                  resolve()
                }).catch((error) => {
                  resolve()
                })
              }).catch((error) => {
                resolve()
              })
            }).catch((error) => {
              resolve()
            })
          }).catch((error) => {
            resolve()
          })
        }).catch((error) => {
          console.log(error)
          resolve()
        })
      }).catch((error) => {
        console.log(error)
        resolve()
      })
    }).catch((error) => {
      console.log(error)
      resolve()
    })
  })
}

/**
 * Function that save challenge type
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function saveChallengeType(userId, challengetype, challengeName, sourceType) {
  
  var data = {
    uid : userId,
    challenge_type : challengetype,
    challenge_name : challengeName,
    source_type : sourceType
  }

  let query = `SELECT * FROM ${table.CHALLENGE_LIST} WHERE uid = ? AND challenge_type = ? AND challenge_name = ? AND source_type = ?`
    
  return new Promise((resolve, reject) => {
    db.query(query, [userId, challengetype, challengeName, sourceType], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0) {
          let query = `UPDATE ${table.CHALLENGE_LIST} SET challenge_type = ?, challenge_name = ?, source_type = ? WHERE id = ?`

          db.query(query, [challengetype, challengeName, sourceType, rows.id], (error, result, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve()
            }
          })
        } else {
          let query = `INSERT INTO ${table.CHALLENGE_LIST} set ? `

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
 * Function that save challenge type
 * @author  YingTuring <ying@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function saveSendEmailChallengeDate(userId, challengetype) {
  let sendDate = new Date()

  let query = `UPDATE ${table.CHALLENGE_LIST} SET send_date = ? WHERE uid = ? AND challenge_type = ?`
    
  return new Promise((resolve, reject) => {
    db.query(query, [sendDate, userId, challengetype], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        resolve()
      }
    })
  })
}

/**
 * Function that save challenge type
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object data
 * @return  object if success returns object else returns message
 */
function saveUserExperience(data) {
  let existsQuery = `SELECT * FROM ${table.USER_EXPERIENCE} WHERE uid = ${data.uid}`
  let query = `INSERT INTO ${table.USER_EXPERIENCE} (uid, english_skill, english_experience, software_engineer_experience, engineering_manager_experience, spending_time_on, availability) VALUES (?, ?, ?, ?, ?, ?, ?)`
    
  return new Promise((resolve, reject) => {
    db.query(existsQuery, [data.uid], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if(rows.length === 0) {
          db.query(query, [data.uid, data.englishSkill, data.englishExperience, data.softwareEngineerExperience, data.engineeringManagerExperience, data.spendingTimeOn, data.availability], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve({message: "done"})
            }
          })
        } else {
          let updateQuery = `UPDATE ${table.USER_EXPERIENCE} SET english_skill = ?, english_experience = ?, software_engineer_experience = ?, engineering_manager_experience = ?, spending_time_on = ?, availability = ? WHERE uid = ?`
          db.query(updateQuery, [data.englishSkill, data.englishExperience, data.softwareEngineerExperience, data.engineeringManagerExperience, data.spendingTimeOn, data.availability, data.uid], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve({message: "done"})
            }
          })
        }
      }
    })
  })
}

module.exports = submitModel
