/**
 * Visit model file
 *
 * @package   backend/src/models
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var table  = require('../constants/table')
var timer  = require('../constants/timer')

var visitModel = {
  checkVisitSession: checkVisitSession,
  checkVisitSessionExtra: checkVisitSessionExtra,
  checkVisitSessionWithExtraInfo: checkVisitSessionWithExtraInfo,
  insertVisitInfo: insertVisitInfo,
  updateVisitInfo: updateVisitInfo,
  updateExtraData: updateExtraData,
  insertSubmitList: insertSubmitList,
  updateSubmitList: updateSubmitList,
  insertVisitWithExtraInfo: insertVisitWithExtraInfo,
  updateVisitWithExtraInfo: updateVisitWithExtraInfo
}

/**
 * Function that check visit numbers and insert row into vist_list table
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string token
 * @return  string 
 */
function checkVisitSession(db, uid, isLogin) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.VISIT_LIST + ' WHERE uid = ? ORDER BY updated_date DESC'

    db.query(query, [uid], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        let visitNumber = 1
        let extraData = {
          registerGoogle: 0,
          registerFacebook: 0,
          registerLinkedin: 0,
          registerGithub: 0,
          fromWhere: '',
          logoutStatus: ''
        }

        if (rows.length > 0) {
          let updatedDate = new Date(rows[0].updated_date)
          let currentDate = new Date()
          let comparedDate = updatedDate.setMinutes(updatedDate.getMinutes() + timer.VISIT_SESSION_MINS)

          extraData = {
            registerGoogle: rows[0].register_google,
            registerFacebook: rows[0].register_facebook,
            registerLinkedin: rows[0].register_linkedin,
            registerGithub: rows[0].register_github,
            fromWhere: rows[0].from_where,
            logoutStatus: rows[0].logout_status
          }
          if (rows[0].logout_status.length > 0) {
            extraData.logoutStatus = ''
          }
          
          if (isLogin) {
            visitNumber = Number(rows[0].visit_number) + 1
            visitModel.insertVisitInfo(db, uid, visitNumber, extraData).then((result) => {
              resolve(result)
            })
          } else {
            if (currentDate > comparedDate) {
              visitNumber = Number(rows[0].visit_number) + 1
              visitModel.insertVisitInfo(db, uid, visitNumber, extraData).then((result) => {
                resolve(result)
              })
            } else {
              visitNumber = Number(rows[0].visit_number)
              visitModel.updateVisitInfo(db, rows[0].id, uid, visitNumber, extraData).then((result) => {
                resolve(result)
              })
            }
          }
        } else {
          visitModel.insertVisitInfo(db, uid, visitNumber, extraData).then((result) => {
            resolve(result)
          })
        }
      }
    })
  })
}

/**
 * Function that check visit numbers and insert row into vist_list table
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object db
 * @param   int uid user id
 * @param   boolean isLogin
 * @param   object extraData
 * @return  object resolve
 * @return  string 
 */
function checkVisitSessionExtra(db, uid, extraData, isLogin) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.VISIT_LIST + ' WHERE uid = ? ORDER BY updated_date DESC'

    db.query(query, [uid], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        let visitNumber = 1
        if (rows.length > 0) {
          let updatedDate = new Date(rows[0].updated_date)
          let currentDate = new Date()
          let comparedDate = updatedDate.setMinutes(updatedDate.getMinutes() + timer.VISIT_SESSION_MINS)
          
          let initExtraData = {
            registerGoogle : rows[0].register_google,
            registerFacebook : rows[0].register_facebook,
            registerLinkedin : rows[0].register_linkedin,
            registerGithub : rows[0].register_github,
            fromWhere: rows[0].from_where,
            logoutStatus: rows[0].logout_status
          }
          if (rows[0].logout_status.length > 0) {
            initExtraData.logoutStatus = ''
          }

          let updatedExtraData = updateExtraData(initExtraData, extraData)

          if (isLogin) {
            visitNumber = Number(rows[0].visit_number) + 1
            visitModel.insertVisitInfo(db, uid, visitNumber, updatedExtraData).then((result) => {
              resolve(result)
            })
          } else {
            if (currentDate > comparedDate) {
              visitNumber = Number(rows[0].visit_number) + 1
              visitModel.insertVisitInfo(db, uid, visitNumber, updatedExtraData).then((result) => {
                resolve(result)
              })
            } else {
              visitNumber = Number(rows[0].visit_number)
              visitModel.updateVisitInfo(db, rows[0].id, uid, visitNumber, updatedExtraData).then((result) => {
                resolve(result)
              })
            }
          }
        } else {
          let initExtraData = {
            registerGoogle: 0,
            registerFacebook: 0,
            registerLinkedin: 0,
            registerGithub: 0,
            fromWhere: '',
            logoutStatus: ''
          }
          let updatedExtraData = updateExtraData(initExtraData, extraData)

          visitModel.insertVisitInfo(db, uid, visitNumber, updatedExtraData).then((result) => {
            resolve(result)
          })
        }
      }
    })
  })
}

/**
 * Function that check visit numbers and insert row into vist_list table
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string token
 * @return  string 
 */
function checkVisitSessionWithExtraInfo(db, uid, agentInfo, submitInfo, isLogin, extraData) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.VISIT_LIST + ' WHERE uid = ? ORDER BY updated_date DESC'

    db.query(query, [uid], (error, rows, fields) => {
      if (error) {
        resolve(false)
      } else {
        let visitNumber = 1

        if (rows.length > 0) {
          let updatedDate = new Date(rows[0].updated_date)
          let currentDate = new Date()
          let comparedDate = updatedDate.setMinutes(updatedDate.getMinutes() + timer.VISIT_SESSION_MINS)

          let initExtraData = {
            registerGoogle : rows[0].register_google,
            registerFacebook : rows[0].register_facebook,
            registerLinkedin : rows[0].register_linkedin,
            registerGithub : rows[0].register_github,
            fromWhere: rows[0].from_where,
            logoutStatus: rows[0].logout_status
          }
          if (rows[0].logout_status.length > 0)
          initExtraData.logoutStatus = ''
          
          let updatedExtraData = initExtraData
          if (extraData) {
            updatedExtraData = updateExtraData(initExtraData, extraData)
          }
          
          if (isLogin) {
            visitNumber = Number(rows[0].visit_number) + 1
            visitModel.insertVisitWithExtraInfo(db, uid, visitNumber, rows[0], agentInfo, submitInfo, updatedExtraData).then((result) => {
              resolve(result)
            })
          } else {
            if (currentDate > comparedDate) {
              visitNumber = Number(rows[0].visit_number) + 1
              visitModel.insertVisitWithExtraInfo(db, uid, visitNumber, rows[0], agentInfo, submitInfo, updatedExtraData).then((result) => {
                resolve(result)
              })
            } else {
              visitNumber = Number(rows[0].visit_number)
              visitModel.updateVisitWithExtraInfo(db, rows[0].id, uid, visitNumber, rows[0], agentInfo, submitInfo, updatedExtraData).then((result) => {
                resolve(result)
              })
            }
          }  
        } else {
          let initExtraData = {
            registerGoogle: 0,
            registerFacebook: 0,
            registerLinkedin: 0,
            registerGithub: 0,
            fromWhere: '',
            logoutStatus: ''
          }
          let updatedExtraData = initExtraData
          if (extraData) {
            updatedExtraData = updateExtraData(initExtraData, extraData)
          }

          visitModel.insertVisitWithExtraInfo(db, uid, visitNumber, false, agentInfo, submitInfo, updatedExtraData).then((result) => {
            resolve(result)
          })
        }
      }
    })
  })
}

/**
 * Function that updates extraData object
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object initData
 * @param   object updateData
 * @return  object initData
 */
function updateExtraData(initData, updateData) { 
  
  for (let key in updateData) {
    if (initData.hasOwnProperty(key))
    {
      initData[key] = updateData[key]
    }
  }

  return initData
}

/**
 * Function that insert into visit_list_v4
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object db
 * @param   int uid user id
 * @param   int visitNumber 
 * @param   object extraData
 * @return  object resolve
 */
function insertVisitInfo(db, uid, visitNumber, extraData) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'

    db.query(query, [uid], (error, results, fields) => {
      if (error) {
        resolve(false)
      } else {
        let query = 'INSERT INTO ' + table.VISIT_LIST + ' (' +
          'uid, ' + 
          'visit_number, ' +
          'first_name, ' +
          'last_name, ' +
          'email, ' +
          'country, ' +
          'phone_number, ' +
          'remote_hour, ' +
          'remote_position, ' +
          'remote_custom, ' +
          'remote_home, ' +
          'linkedin_url, ' +
          'recent_employer, ' +
          'recent_position, ' +
          'job_names, ' +
          'job_levels, ' +
          'skill_names, ' +
          'skill_levels, ' +
          'profession, ' +
          'resume_path, ' +
          'referer_url, ' +
          'user_ip, ' +
          'user_country, ' +
          'user_region, ' +
          'user_city, ' +
          'user_browser_name, ' +
          'user_browser_version, ' +
          'user_os, ' +
          'user_screen_width, ' +
          'user_screen_height, ' +
          'test_language, ' +
          'test_user_score_palindrome, ' +
          'test_system_score_palindrome, ' +
          'test_time_palindrome, ' +
          'test_date_palindrome, ' +
          'test_source_path_palindrome, ' +
          'test_user_score_hackland, ' +
          'test_system_score_hackland, ' +
          'test_time_hackland, ' +
          'test_date_hackland, ' +
          'test_source_path_hackland, ' +
          'take_challenge_type, ' +
          's_param, ' +
          'n_param, ' +
          'logged_in_google, ' +
          'logged_in_facebook, ' +
          'quiz_answer, ' +
          'register_google, ' +
          'register_facebook, ' +
          'register_linkedin, ' +
          'register_github, ' +
          'from_where, ' +
          'logout_status, ' +
          'javascript_test_type ' +
          ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

        let values = [
          results[0].uid,
          visitNumber,
          results[0].first_name, 
          results[0].last_name, 
          results[0].email, 
          results[0].country, 
          results[0].phone_number, 
          results[0].remote_hour, 
          results[0].remote_position, 
          results[0].remote_custom, 
          results[0].remote_home, 
          results[0].linkedin_url, 
          results[0].recent_employer, 
          results[0].recent_position, 
          results[0].job_names, 
          results[0].job_levels, 
          results[0].skill_names, 
          results[0].skill_levels, 
          results[0].profession, 
          results[0].resume_path, 
          results[0].referer_url, 
          results[0].user_ip, 
          results[0].user_country, 
          results[0].user_region, 
          results[0].user_city, 
          results[0].user_browser_name, 
          results[0].user_browser_version, 
          results[0].user_os, 
          results[0].user_screen_width, 
          results[0].user_screen_height, 
          results[0].test_language,
          results[0].test_user_score_palindrome,
          results[0].test_system_score_palindrome,
          results[0].test_time_palindrome,
          results[0].test_date_palindrome,
          results[0].test_source_path_palindrome,
          results[0].test_user_score_hackland,
          results[0].test_system_score_hackland,
          results[0].test_time_hackland,
          results[0].test_date_hackland,
          results[0].test_source_path_hackland,
          results[0].take_challenge_type,
          results[0].s_param, 
          results[0].n_param, 
          results[0].logged_in_google, 
          results[0].logged_in_facebook, 
          results[0].quiz_answer,
          extraData.registerGoogle,
          extraData.registerFacebook,
          extraData.registerLinkedin,
          extraData.registerGithub,
          extraData.fromWhere,
          extraData.logoutStatus,
          results[0].javascript_test_type
        ]

        db.query(query, values, (error, queryResult, fields) => {
          if (error) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
      }
    })
  })
}

/**
 * Function that update into visit_list_v4
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object db
 * @param   int id visit list table unique id
 * @param   int uid user id
 * @param   int visitNumber 
 * @param   object extraData
 * @return  string 
 */
function updateVisitInfo(db, id, uid, visitNumber, extraData) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'

    db.query(query, [uid], (error, results, fields) => {
      if (error) {
        resolve(false)
      } else {
        if ((results.length > 0)) {
          let query = 'UPDATE ' + table.VISIT_LIST + ' SET ' +
            'uid = ?, ' +  
            'visit_number = ?, ' +
            'first_name = ?, ' +
            'last_name = ?, ' +
            'email = ?, ' +
            'country = ?, ' +
            'phone_number = ?, ' +
            'remote_hour = ?, ' +
            'remote_position = ?, ' +
            'remote_custom = ?, ' +
            'remote_home = ?, ' +
            'linkedin_url = ?, ' +
            'recent_employer = ?, ' +
            'recent_position = ?, ' +
            'job_names = ?, ' +
            'job_levels = ?, ' +
            'skill_names = ?, ' +
            'skill_levels = ?, ' +
            'profession = ?, ' +
            'resume_path = ?, ' +
            'referer_url = ?, ' +
            'user_ip = ?, ' +
            'user_country = ?, ' +
            'user_region = ?, ' +
            'user_city = ?, ' +
            'user_browser_name = ?, ' +
            'user_browser_version = ?, ' +
            'user_os = ?, ' +
            'user_screen_width = ?, ' +
            'user_screen_height = ?, ' +
            'test_language = ?, ' +
            'test_user_score_palindrome = ?, ' +
            'test_system_score_palindrome = ?, ' +
            'test_time_palindrome = ?, ' +
            'test_date_palindrome = ?, ' +
            'test_source_path_palindrome = ?, ' +
            'test_user_score_hackland = ?, ' +
            'test_system_score_hackland = ?, ' +
            'test_time_hackland = ?, ' +
            'test_date_hackland = ?, ' +
            'test_source_path_hackland = ?, ' +
            'take_challenge_type = ?, ' +
            's_param = ?, ' +
            'n_param = ?, ' +
            'logged_in_google = ?, ' +
            'logged_in_facebook = ?, ' +
            'quiz_answer = ?, ' +
            'register_google = ?, ' +
            'register_facebook = ?, ' +
            'register_linkedin = ?, ' +
            'register_github  = ?, ' +
            'from_where  = ?, ' +
            'logout_status  = ?, ' +
            'javascript_test_type = ? ' +
            'WHERE id = ?'

          let values = [
            results[0].uid,
            visitNumber,
            results[0].first_name, 
            results[0].last_name, 
            results[0].email, 
            results[0].country, 
            results[0].phone_number, 
            results[0].remote_hour, 
            results[0].remote_position, 
            results[0].remote_custom, 
            results[0].remote_home, 
            results[0].linkedin_url, 
            results[0].recent_employer, 
            results[0].recent_position, 
            results[0].job_names, 
            results[0].job_levels, 
            results[0].skill_names, 
            results[0].skill_levels, 
            results[0].profession, 
            results[0].resume_path, 
            results[0].referer_url, 
            results[0].user_ip, 
            results[0].user_country, 
            results[0].user_region, 
            results[0].user_city, 
            results[0].user_browser_name, 
            results[0].user_browser_version, 
            results[0].user_os, 
            results[0].user_screen_width, 
            results[0].user_screen_height, 
            results[0].test_language,
            results[0].test_user_score_palindrome,
            results[0].test_system_score_palindrome,
            results[0].test_time_palindrome,
            results[0].test_date_palindrome,
            results[0].test_source_path_palindrome,
            results[0].test_user_score_hackland,
            results[0].test_system_score_hackland,
            results[0].test_time_hackland,
            results[0].test_date_hackland,
            results[0].test_source_path_hackland,
            results[0].take_challenge_type,
            results[0].s_param, 
            results[0].n_param, 
            results[0].logged_in_google, 
            results[0].logged_in_facebook, 
            results[0].quiz_answer,
            extraData.registerGoogle,
            extraData.registerFacebook,
            extraData.registerLinkedin,
            extraData.registerGithub,
            extraData.fromWhere,
            extraData.logoutStatus, 
            results[0].javascript_test_type,
            id
          ]

          db.query(query, values, (error, queryResult, fields) => {
            if (error) {
              resolve(false)
            } else {
              resolve(true)
            }
          })
        } else {
          resolve(false)
        }
      }  
    })
  })
}

/**
 * Function that insert into visit_list_v4
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object db
 * @param   int uid user id
 * @param   int visitNumber 
 * @param   object extraData
 * @return  object resolve
 */
function insertVisitWithExtraInfo(db, uid, visitNumber, prevRecord, agentInfo, submitInfo, extraData) {
  let data = {
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phoneNumber: '',
    remoteHour: '',
    remotePosition: '',
    remoteCustom: '',
    remoteHome: '',
    linkedinUrl: '',
    recentEmployer: '',
    recentPosition: '',
    jobNames: '',
    jobLevels: '',
    skillNames: '', 
    skillLevels: '', 
    profession: '', 
    resumePath: '',
    refererUrl: '',
    userIp: '',
    userCountry: '', 
    userRegion: '', 
    userCity: '', 
    userBrowserName: '', 
    userBrowserVersion: '', 
    userOs: '', 
    userScreenWidth: null, 
    userScreenHeight: null, 
    testLanguage: '', 
    testUserScorePalindrome: null, 
    testSystemScorePalindrome: null, 
    testTimePalindrome: null,
    testDatePalindrome: null,
    testSourcePathPalindrome: '',
    testUserScoreHackland: null,
    testSystemScoreHackland: null, 
    testTimeHackland: null,
    testDateHackland: null, 
    testSourcePathHackland: '', 
    takeChallengeType: 0, 
    sParam: '', 
    nParam: '', 
    loggedInGoogle: 'false', 
    loggedInFacebook: 'false', 
    quizAnswer: '',
    javascriptTestType: 0
  }

  if (prevRecord) {
    data.firstName = prevRecord.first_name
    data.lastName = prevRecord.last_name
    data.email = prevRecord.email
    data.country = prevRecord.country
    data.phoneNumber = prevRecord.phone_number
    data.remoteHour = prevRecord.remote_hour
    data.remotePosition = prevRecord.remote_position
    data.remoteCustom = prevRecord.remote_custom
    data.remoteHome = prevRecord.remote_home
    data.linkedinUrl = prevRecord.linkedin_url
    data.recentEmployer = prevRecord.recent_employer
    data.recentPosition = prevRecord.recent_position
    data.jobNames = prevRecord.job_names
    data.jobLevels = prevRecord.job_levels
    data.skillNames = prevRecord.skill_names
    data.skillLevels = prevRecord.skill_levels
    data.profession = prevRecord.profession
    data.resumePath = prevRecord.resume_path
    data.refererUrl = prevRecord.referer_url
    data.userIp = prevRecord.user_ip
    data.userCountry = prevRecord.user_country
    data.userRegion = prevRecord.user_region
    data.userCity = prevRecord.user_city
    data.userBrowserName = prevRecord.user_browser_name
    data.userBrowserVersion = prevRecord.user_browser_version
    data.userOs = prevRecord.user_os 
    data.userScreenWidth = prevRecord.user_screen_width
    data.userScreenHeight = prevRecord.user_screen_height
    data.testLanguage = prevRecord.test_language
    data.testUserScorePalindrome = prevRecord.test_user_score_palindrome
    data.testSystemScorePalindrome = prevRecord.test_system_score_palindrome
    data.testTimePalindrome = prevRecord.test_time_palindrome
    data.testDatePalindrome = prevRecord.test_date_palindrome
    data.testSourcePathPalindrome = prevRecord.test_source_path_palindrome
    data.testUserScoreHackland = prevRecord.test_user_score_hackland
    data.testSystemScoreHackland = prevRecord.test_system_score_hackland
    data.testTimeHackland = prevRecord.test_time_hackland
    data.testDateHackland = prevRecord.test_date_hackland
    data.testSourcePathHackland = prevRecord.test_source_path_hackland
    data.takeChallengeType = prevRecord.take_challenge_type
    data.sParam = prevRecord.s_param
    data.nParam = prevRecord.n_param
    data.loggedInGoogle = prevRecord.logged_in_google
    data.loggedInFacebook = prevRecord.logged_in_facebook 
    data.quizAnswer = prevRecord.quiz_answer
    data.javascriptTestType = prevRecord.javascript_test_type
  } 
  if (agentInfo) {
    data.profession = agentInfo.profession
    data.refererUrl = agentInfo.referrerUrl
    data.userIp = agentInfo.ip
    data.userCountry = agentInfo.country 
    data.userRegion = agentInfo.region
    data.userCity = agentInfo.city
    data.userBrowserName = agentInfo.browserName 
    data.userBrowserVersion = agentInfo.browserVersion
    data.userOs = agentInfo.os 
    data.userScreenWidth = agentInfo.screenWidth
    data.userScreenHeight = agentInfo.screenHeight
    data.sParam = agentInfo.adsSite
    data.nParam = agentInfo.campaignNum
    data.loggedInGoogle = agentInfo.googleStatus
    data.loggedInFacebook = agentInfo.facebookStatus 
    data.quizAnswer = agentInfo.quizAnswer
  }
  if (submitInfo) {
    if ((prevRecord) && ((prevRecord.first_name === null) || (prevRecord.first_name === '')))
    {
      data.firstName = submitInfo.firstName
    }
    if ((prevRecord) && ((prevRecord.last_name === null) || (prevRecord.last_name === '')))
    {
      data.lastName = submitInfo.lastName
    }
    data.email = submitInfo.email
  }

  return new Promise((resolve, reject) => {
    let query = 'INSERT INTO ' + table.VISIT_LIST + ' (' +
      'uid, ' + 
      'visit_number, ' +
      'first_name, ' +
      'last_name, ' +
      'email, ' +
      'country, ' +
      'phone_number, ' +
      'remote_hour, ' +
      'remote_position, ' +
      'remote_custom, ' +
      'remote_home, ' +
      'linkedin_url, ' +
      'recent_employer, ' +
      'recent_position, ' +
      'job_names, ' +
      'job_levels, ' +
      'skill_names, ' +
      'skill_levels, ' +
      'profession, ' +
      'resume_path, ' +
      'referer_url, ' +
      'user_ip, ' +
      'user_country, ' +
      'user_region, ' +
      'user_city, ' +
      'user_browser_name, ' +
      'user_browser_version, ' +
      'user_os, ' +
      'user_screen_width, ' +
      'user_screen_height, ' +
      'test_language, ' +
      'test_user_score_palindrome, ' +
      'test_system_score_palindrome, ' +
      'test_time_palindrome, ' +
      'test_date_palindrome, ' +
      'test_source_path_palindrome, ' +
      'test_user_score_hackland, ' +
      'test_system_score_hackland, ' +
      'test_time_hackland, ' +
      'test_date_hackland, ' +
      'test_source_path_hackland, ' +
      'take_challenge_type, ' +
      's_param, ' +
      'n_param, ' +
      'logged_in_google, ' +
      'logged_in_facebook, ' +
      'quiz_answer, ' +
      'register_google, ' +
      'register_facebook, ' +
      'register_linkedin, ' +
      'register_github, ' +
      'from_where, ' +
      'logout_status, ' +
      'javascript_test_type ' +
      ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

    let values = [
      uid,
      visitNumber,
      data.firstName,
      data.lastName,
      data.email,
      data.country,
      data.phoneNumber,
      data.remoteHour,
      data.remotePosition,
      data.remoteCustom,
      data.remoteHome,
      data.linkedinUrl,
      data.recentEmployer,
      data.recentPosition,
      data.jobNames,
      data.jobLevels,
      data.skillNames, 
      data.skillLevels, 
      data.profession, 
      data.resumePath,
      data.refererUrl,
      data.userIp,
      data.userCountry, 
      data.userRegion, 
      data.userCity, 
      data.userBrowserName, 
      data.userBrowserVersion, 
      data.userOs, 
      data.userScreenWidth, 
      data.userScreenHeight, 
      data.testLanguage, 
      data.testUserScorePalindrome, 
      data.testSystemScorePalindrome, 
      data.testTimePalindrome,
      data.testDatePalindrome,
      data.testSourcePathPalindrome,
      data.testUserScoreHackland,
      data.testSystemScoreHackland, 
      data.testTimeHackland, 
      data.testDateHackland, 
      data.testSourcePathHackland, 
      data.takeChallengeType, 
      data.sParam, 
      data.nParam, 
      data.loggedInGoogle, 
      data.loggedInFacebook, 
      data.quizAnswer,
      extraData.registerGoogle,
      extraData.registerFacebook,
      extraData.registerLinkedin,
      extraData.registerGithub,
      extraData.fromWhere,
      extraData.logoutStatus,
      data.javascriptTestType
    ]

    db.query(query, values, (error, queryResult, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (!submitInfo) {
          if ((data.email !==null) && (data.email !=='')) {
            let query = 'SELECT * FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'
            db.query(query, [uid], (error, results, fields) => {
              if (error) {
                resolve(false)
              } else {
                if (results.length > 0) {
                  // update submit list with agent info
                  visitModel.updateSubmitList(db, uid, data).then((result) =>{
                    resolve(result)                  
                  })
                } else {
                  resolve(true)
                }
              }
            })
          } else {
            resolve(true)
          }
        } else {
          visitModel.insertSubmitList(db, uid, data).then((result) =>{
            resolve(result)                  
          })
        } 
      }
    })
  })
}

/**
 * Function that update into visit_list_v4
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object db
 * @param   int id visit list table unique id
 * @param   int uid user id
 * @param   int visitNumber 
 * @param   object extraData
 * @return  string 
 */
function updateVisitWithExtraInfo(db, id, uid, visitNumber, prevRecord, agentInfo, submitInfo, extraData) {
  let data = {
    firstName: '',
    lastName: '',
    email: '',
    profession: '',
    refererUrl: '',
    userIp: '',
    userCountry: '', 
    userRegion: '', 
    userCity: '', 
    userBrowserName: '', 
    userBrowserVersion: '', 
    userOs: '', 
    userScreenWidth: null, 
    userScreenHeight: null, 
    sParam: '', 
    nParam: '', 
    loggedInGoogle: 'false', 
    loggedInFacebook: 'false', 
    quizAnswer: '', 
  }

  if (prevRecord) {
    data.firstName = prevRecord.first_name
    data.lastName = prevRecord.last_name
    data.email = prevRecord.email
    data.profession = prevRecord.profession
    data.refererUrl = prevRecord.referer_url
    data.userIp = prevRecord.user_ip
    data.userCountry = prevRecord.user_country
    data.userRegion = prevRecord.user_region
    data.userCity = prevRecord.user_city
    data.userBrowserName = prevRecord.user_browser_name
    data.userBrowserVersion = prevRecord.user_browser_version
    data.userOs = prevRecord.user_os 
    data.userScreenWidth = prevRecord.user_screen_width
    data.userScreenHeight = prevRecord.user_screen_height
    data.sParam = prevRecord.s_param
    data.nParam = prevRecord.n_param
    data.loggedInGoogle = prevRecord.logged_in_google
    data.loggedInFacebook = prevRecord.logged_in_facebook 
    data.quizAnswer = prevRecord.quiz_answer
  }

  if (agentInfo) {
    data.profession = agentInfo.profession
    data.refererUrl = agentInfo.referrerUrl
    data.userIp = agentInfo.ip
    data.userCountry = agentInfo.country 
    data.userRegion = agentInfo.region
    data.userCity = agentInfo.city
    data.userBrowserName = agentInfo.browserName 
    data.userBrowserVersion = agentInfo.browserVersion
    data.userOs = agentInfo.os 
    data.userScreenWidth = agentInfo.screenWidth
    data.userScreenHeight = agentInfo.screenHeight
    data.sParam = agentInfo.adsSite
    data.nParam = agentInfo.campaignNum
    data.loggedInGoogle = agentInfo.googleStatus
    data.loggedInFacebook = agentInfo.facebookStatus 
    data.quizAnswer = agentInfo.quizAnswer
  }

  if (submitInfo) {
    if ((prevRecord) && ((prevRecord.first_name === null) || (prevRecord.first_name === '')))
    {
      data.firstName = submitInfo.firstName
    }
    if ((prevRecord) && ((prevRecord.last_name === null) || (prevRecord.last_name === '')))
    {
      data.lastName = submitInfo.lastName
    }
    data.email = submitInfo.email
  }

  return new Promise((resolve, reject) => {
    let query = 'UPDATE ' + table.VISIT_LIST + ' SET ' +
      'uid = ?, ' +  
      'visit_number = ?, ' + 
      'first_name = ?, ' +
      'last_name = ?, ' +
      'email = ?, ' +
      'profession = ?, ' +
      'referer_url = ?, ' +
      'user_ip = ?, ' +
      'user_country = ?, ' +
      'user_region = ?, ' +
      'user_city = ?, ' +
      'user_browser_name = ?, ' +
      'user_browser_version = ?, ' +
      'user_os = ?, ' +
      'user_screen_width = ?, ' +
      'user_screen_height = ?, ' +
      's_param = ?, ' +
      'n_param = ?, ' +
      'logged_in_google = ?, ' +
      'logged_in_facebook = ?, ' +
      'quiz_answer = ?, ' +
      'register_google = ?, ' +
      'register_facebook = ?, ' +
      'register_linkedin = ?, ' +
      'register_github  = ?, ' +
      'from_where  = ?, ' +
      'logout_status  = ? ' +
      'WHERE id = ? '

    let values = [
      uid,
      visitNumber,
      data.firstName,
      data.lastName,
      data.email,
      data.profession, 
      data.refererUrl,
      data.userIp,
      data.userCountry,
      data.userRegion,
      data.userCity, 
      data.userBrowserName, 
      data.userBrowserVersion, 
      data.userOs,
      data.userScreenWidth,
      data.userScreenHeight,
      data.sParam,
      data.nParam,
      data.loggedInGoogle, 
      data.loggedInFacebook, 
      data.quizAnswer, 
      extraData.registerGoogle,
      extraData.registerFacebook,
      extraData.registerLinkedin,
      extraData.registerGithub, 
      extraData.fromWhere,
      extraData.logoutStatus,
      id
    ]

    db.query(query, values, (error, queryResult, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (!submitInfo) {
          if ((data.email !==null) && (data.email !=='')) {
            let query = 'SELECT * FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'
            db.query(query, [uid], (error, results, fields) => {
              if (error) {
                resolve(false)
              } else {
                if (results.length > 0) {
                  // update submit list with agent info
                  visitModel.updateSubmitList(db, uid, data).then((result) =>{
                    resolve(result)                  
                  })
                } else {
                  resolve(true)
                }
              }
            })
          } else {
            resolve(true)
          }
        } else {
          visitModel.insertSubmitList(db, uid, data).then((result) =>{
            resolve(result)
          })
        } 
      }
    })    
  })
}

/**
 * Function that update into submit_list_v4
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object db
 * @param   int id visit list table unique id
 * @param   int uid user id
 * @param   int visitNumber 
 * @param   object extraData
 * @return  string 
 */
function updateSubmitList(db, uid, data) {
  return new Promise((resolve, reject) => {
    let query = 'UPDATE ' + table.SUBMIT_LIST + ' SET ' +
    'email = ?, ' +
    'first_name = ?, ' +
    'last_name = ?, ' +
    'profession = ?, ' +
    'referer_url = ?, ' +
    'user_ip = ?, ' +
    'user_country = ?, ' +
    'user_region = ?, ' +
    'user_city = ?, ' +
    'user_browser_name = ?, ' +
    'user_browser_version = ?, ' +
    'user_os = ?, ' +
    'user_screen_width = ?, ' +
    'user_screen_height = ?, ' +
    's_param = ?, ' +
    'n_param = ?, ' +
    'logged_in_google = ?, ' +
    'logged_in_facebook = ?, ' +
    'quiz_answer = ? ' +
    'WHERE uid = ? '

    let values = [
      data.email,
      data.firstName,
      data.lastName,
      data.profession,
      data.refererUrl,
      data.userIp,
      data.userCountry, 
      data.userRegion, 
      data.userCity, 
      data.userBrowserName, 
      data.userBrowserVersion, 
      data.userOs, 
      data.userScreenWidth, 
      data.userScreenHeight, 
      data.sParam,
      data.nParam,
      data.loggedInGoogle,
      data.loggedInFacebook,
      data.quizAnswer,
      uid
    ]
    db.query(query, values, (error, queryResult, fields) => {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Function that update into submit_list_v4
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object db
 * @param   int id visit list table unique id
 * @param   int uid user id
 * @param   int visitNumber 
 * @param   object extraData
 * @return  string 
 */
function insertSubmitList(db, uid, data) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.SUBMIT_LIST + ' WHERE uid = ?'
    db.query(query, [uid], (error, results, fields) => {
      if (error) {
        resolve(false)
      } else {
        if (results.length > 0) {
          visitModel.updateSubmitList(db, uid, data).then((result) =>{
            resolve(result)                  
          })
        } else {
          let query = 'INSERT INTO ' + table.SUBMIT_LIST + ' (' +
          'uid, ' + 
          'email, ' +
          'first_name, ' +
          'last_name, ' +
          'profession, ' +
          'referer_url, ' +
          'user_ip, ' +
          'user_country, ' +
          'user_region, ' +
          'user_city, ' +
          'user_browser_name, ' +
          'user_browser_version, ' +
          'user_os, ' +
          'user_screen_width, ' +
          'user_screen_height, ' +
          's_param, ' +
          'n_param, ' +
          'logged_in_google, ' +
          'logged_in_facebook, ' +
          'quiz_answer ' +
          ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

          let values = [
            uid,
            data.email,
            data.firstName,
            data.lastName,
            data.profession,
            data.refererUrl,
            data.userIp,
            data.userCountry, 
            data.userRegion, 
            data.userCity, 
            data.userBrowserName, 
            data.userBrowserVersion, 
            data.userOs, 
            data.userScreenWidth, 
            data.userScreenHeight, 
            data.sParam,
            data.nParam,
            data.loggedInGoogle,
            data.loggedInFacebook,
            data.quizAnswer
          ]
          db.query(query, values, (error, queryResult, fields) => {
            if (error) {
              resolve(false)
            } else {
              resolve(true)
            }
          })
        }
      }
    })      
  })
}

module.exports = visitModel
