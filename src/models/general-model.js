/**
 * General model file
 *
 * @package   backend/src/models
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/general/
 */

var db = require('../database/database')
var message  = require('../constants/message')
var table  = require('../constants/table')

var generalModel = {
  getContactList: getContactList,
  getContactSearchQuery: getContactSearchQuery,
  getVisitHistory: getVisitHistory,
  getChallengeList: getChallengeList,
  getChallengeSearchQuery: getChallengeSearchQuery,
  getChallengeLogList: getChallengeLogList,
  getChallengeLogSearchQuery: getChallengeLogSearchQuery,
  getChallengeTopErrors: getChallengeTopErrors
}

/**
 * Function that get contact list
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  object if success returns object else returns message
 */
function getContactList(data) {
  let query = `SELECT count(*) AS count 
    FROM ${table.SUBMIT_LIST} 
    LEFT JOIN ${table.LINKEDIN_LIST} ON ${table.LINKEDIN_LIST}.luid = ${table.SUBMIT_LIST}.uid 
    LEFT JOIN ${table.GOOGLE_LIST} ON ${table.GOOGLE_LIST}.ouid = ${table.SUBMIT_LIST}.uid 
    LEFT JOIN ${table.FACEBOOK_LIST} ON ${table.FACEBOOK_LIST}.fuid = ${table.SUBMIT_LIST}.uid 
    LEFT JOIN ${table.GITHUB_LIST} ON ${table.GITHUB_LIST}.guid = ${table.SUBMIT_LIST}.uid
    LEFT JOIN ${table.CHALLENGE_TYPE} ON ${table.CHALLENGE_TYPE}.id = ${table.SUBMIT_LIST}.take_challenge_type
    LEFT JOIN ${table.USER_EXPERIENCE} ON ${table.SUBMIT_LIST}.uid = ${table.USER_EXPERIENCE}.uid`

  query += generalModel.getContactSearchQuery(data, false)

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let count = 0
        if (rows.length > 0) {
          count = rows[0].count
        }

        let query = `SELECT ${table.SUBMIT_LIST}.*, ${table.LINKEDIN_LIST}.*, ${table.GOOGLE_LIST}.*, ${table.FACEBOOK_LIST}.*, ${table.GITHUB_LIST}.*, ${table.CHALLENGE_TYPE}.challenge_name, ${table.USER_EXPERIENCE}.*
          FROM ${table.SUBMIT_LIST} 
          LEFT JOIN ${table.LINKEDIN_LIST} ON ${table.LINKEDIN_LIST}.luid = ${table.SUBMIT_LIST}.uid 
          LEFT JOIN ${table.GOOGLE_LIST} ON ${table.GOOGLE_LIST}.ouid = ${table.SUBMIT_LIST}.uid 
          LEFT JOIN ${table.FACEBOOK_LIST} ON ${table.FACEBOOK_LIST}.fuid = ${table.SUBMIT_LIST}.uid 
          LEFT JOIN ${table.GITHUB_LIST} ON ${table.GITHUB_LIST}.guid = ${table.SUBMIT_LIST}.uid
          LEFT JOIN ${table.CHALLENGE_TYPE} ON ${table.CHALLENGE_TYPE}.id = ${table.SUBMIT_LIST}.take_challenge_type
          LEFT JOIN ${table.USER_EXPERIENCE} ON ${table.SUBMIT_LIST}.uid = ${table.USER_EXPERIENCE}.uid`
        query += generalModel.getContactSearchQuery(data, false)
        query += ` ORDER BY ${table.SUBMIT_LIST}.created_date DESC`
                
        if (data.page != -1 && data.rowsPerPage != -1) {
          query += ` LIMIT ${data.page * data.rowsPerPage}, ${data.rowsPerPage}`
        }

        db.query(query, (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
            resolve({ count: count, rows: rows })
          }
        })
      }
    })
  })
}

function getContactSearchQuery(data, isVisitHistory) {
  let where = ``
  if (isVisitHistory) {
    where = ` WHERE ${table.VISIT_LIST}.id>0`
  } else {
    where = ` WHERE ${table.SUBMIT_LIST}.id>0`
  }

  if (data.startDate !== '') {
    where += ` AND Date(created_date)>="${data.startDate}"`
  }

  if (data.endDate !== '') {
    where += ` AND Date(created_date)<="${data.endDate}"`
  }

  if (data.emailAddress == 1) {
    where += ' AND email<>""'
  } else if (data.emailAddress == 2) {
    where += ' AND email=""'
  }

  if (data.linkedinAccount == 1) {
    where += ' AND lerror_code<>"" AND lerror_code IS NOT NULL AND lerror_code<>"don\'t_have_account"'
  } else if (data.linkedinAccount == 2) {
    where += ' AND lerror_code="don\'t_have_account"'
  } else if (data.linkedinAccount == 3) {
    where += ' AND (lerror_code="" OR lerror_code IS NULL)'
  }

  if (data.googleAccount == 1) {
    where += ' AND oerror_code<>"" AND oerror_code IS NOT NULL AND oerror_code<>"don\'t_have_account"'
  } else if (data.googleAccount == 2) {
    where += ' AND oerror_code="don\'t_have_account"'
  } else if (data.googleAccount == 3) {
    where += ' AND (oerror_code="" OR oerror_code IS NULL)'
  }

  if (data.facebookAccount == 1) {
    where += ' AND ferror_code<>"" AND ferror_code IS NOT NULL AND ferror_code<>"don\'t_have_account"'
  } else if (data.facebookAccount == 2) {
    where += ' AND ferror_code="don\'t_have_account"'
  } else if (data.facebookAccount == 3) {
    where += ' AND (ferror_code="" OR ferror_code IS NULL)'
  }

  if (data.githubAccount == 1) {
    where += ' AND gerror_code<>"" AND gerror_code IS NOT NULL AND gerror_code<>"don\'t_have_account"'
  } else if (data.githubAccount == 2) {
    where += ' AND gerror_code="don\'t_have_account"'
  } else if (data.githubAccount == 3) {
    where += ' AND (gerror_code="" OR gerror_code IS NULL)'
  }

  if (data.resumeFile == 1) {
    where += ' AND resume_path<>""'
  } else if (data.resumeFile == 2) {
    where += ' AND resume_path=""'
  }

  // Referrer URL
  if (data.referrerUrl == 1) {
    where += ' AND referer_url LIKE "%google%"'
  } else if (data.referrerUrl == 2) {
    where += ' AND referer_url LIKE "%facebook.%"'
  } else if (data.referrerUrl == 3) {
    where += ' AND referer_url LIKE "%linkedin.%"'
  } else if (data.referrerUrl == 4) {
    where += ' AND referer_url LIKE "%instagram.%"'
  } else if (data.referrerUrl == 5) {
    where += ' AND referer_url NOT LIKE "%google%" AND referer_url NOT LIKE "%facebook.%" AND referer_url NOT LIKE "%linkedin.%" AND referer_url NOT LIKE "%instagram.%" AND referer_url<>""'
  } else if (data.referrerUrl == 6) {
    where += ' AND referer_url=""'
  }

  // Profession
  if (data.profession == 1) {
    where += ' AND profession="I am a Software Engineer"'
  } else if (data.profession == 2) {
    where += ' AND profession<>"I am a Software Engineer" AND profession<>""'
  } else if (data.profession == 3) {
    where += ' AND profession=""'
  }

  // Web browser
  if (data.webBrowser == 1) {
    where += ' AND user_browser_name="Chrome"'
  } else if (data.webBrowser == 2) {
    where += ' AND user_browser_name="Firefox"'
  } else if (data.webBrowser == 3) {
    where += ' AND user_browser_name="Internet Explorer"'
  } else if (data.webBrowser == 4) {
    where += ' AND user_browser_name="Mozilla"'
  } else if (data.webBrowser == 5) {
    where += ' AND user_browser_name="Opera"'
  } else if (data.webBrowser == 6) {
    where += ' AND user_browser_name="Phoenix"'
  } else if (data.webBrowser == 7) {
    where += ' AND user_browser_name="Safari"'
  } else if (data.webBrowser == 8) {
    where += ' AND user_browser_name="Spartan"'
  } else if (data.webBrowser == 9) {
    where += ' AND user_browser_name=""'
  }

  if (data.deviceType == 1) {             // Desktop
    where += ' AND (user_os="Windows 95" OR user_os="Windows 98" OR user_os="Windows NT 4.0" OR user_os="Windows XP" OR user_os="Windows Vista" OR user_os="Windows 2000" OR user_os="Windows 2003" OR user_os="Windows 7" OR user_os="Windows 8" OR user_os="Windows 8.1" OR user_os="Windows 10" OR user_os="Linux" OR user_os="Mac OS X" OR user_os="FreeBSD")'
  } else if (data.deviceType == 2) {      // Mobile, Tablet
    where += ' AND (user_os="Android" OR user_os="iOS" OR user_os="Windows Phone" OR user_os="BlackBerry" OR user_os="Symbian OS")'
  } else if (data.deviceType == 3) {
    where += ' AND (user_os="" OR user_os LIKE "%Unknown%")'
  }

  if (data.testLanguage == 1) {
    where += ' AND test_language="JavaScript"'
  } else if (data.testLanguage == 2) {
    where += ' AND test_language="Java"'
  } else if (data.testLanguage == 3) {
    where += ' AND test_language="Python"'
  } else if (data.testLanguage == 4) {
    where += ' AND test_language="Objective-C"'
  } else if (data.testLanguage == 5) {
    where += ' AND test_language="Swift"'
  } else if (data.testLanguage == 6) {
    where += ' AND test_language="Ruby"'
  } else if (data.testLanguage == 7) {
    where += ' AND test_language="Scala"'
  } else if (data.testLanguage == 8) {
    where += ' AND test_language="PHP"'
  } else if (data.testLanguage == 9) {
    where += ' AND test_language="C++"'
  } else if (data.testLanguage == 10) {
    where += ' AND test_language="C"'
  } else if (data.testLanguage == 11) {
    where += ' AND test_language=""'
  }

  if (data.testUserScorePalindrome == 1) {
    where += ' AND test_user_score_palindrome>=0 AND test_user_score_palindrome<=30'
  } else if (data.testUserScorePalindrome == 2) {
    where += ' AND test_user_score_palindrome>30 AND test_user_score_palindrome<=60'
  } else if (data.testUserScorePalindrome == 3) {
    where += ' AND test_user_score_palindrome>60 AND test_user_score_palindrome<=100'
  } else if (data.testUserScorePalindrome == 4) {
    where += ' AND test_user_score_palindrome>=0 AND test_user_score_palindrome<100'
  } else if (data.testUserScorePalindrome == 5) {
    where += ' AND test_user_score_palindrome=100'
  } else if (data.testUserScorePalindrome == 6) {
    where += ' AND test_user_score_palindrome IS NOT NULL'
  } else if (data.testUserScorePalindrome == 7) {
    where += ' AND test_user_score_palindrome IS NULL'
  }

  if (data.testSystemScorePalindrome == 1) {
    where += ' AND test_system_score_palindrome>=0 AND test_system_score_palindrome<=30'
  } else if (data.testSystemScorePalindrome == 2) {
    where += ' AND test_system_score_palindrome>30 AND test_system_score_palindrome<=60'
  } else if (data.testSystemScorePalindrome == 3) {
    where += ' AND test_system_score_palindrome>60 AND test_system_score_palindrome<=100'
  } else if (data.testSystemScorePalindrome == 4) {
    where += ' AND test_system_score_palindrome>=0 AND test_system_score_palindrome<100'
  } else if (data.testSystemScorePalindrome == 5) {
    where += ' AND test_system_score_palindrome=100'
  } else if (data.testSystemScorePalindrome == 6) {
    where += ' AND test_system_score_palindrome IS NOT NULL'
  } else if (data.testSystemScorePalindrome == 7) {
    where += ' AND test_system_score_palindrome IS NULL'
  }

  if (data.testUserScoreHackland == 1) {
    where += ' AND test_user_score_hackland>=0 AND test_user_score_hackland<=30'
  } else if (data.testUserScoreHackland == 2) {
    where += ' AND test_user_score_hackland>30 AND test_user_score_hackland<=60'
  } else if (data.testUserScoreHackland == 3) {
    where += ' AND test_user_score_hackland>60 AND test_user_score_hackland<=100'
  } else if (data.testUserScoreHackland == 4) {
    where += ' AND test_user_score_hackland>=0 AND test_user_score_hackland<100'
  } else if (data.testUserScoreHackland == 5) {
    where += ' AND test_user_score_hackland=100'
  } else if (data.testUserScoreHackland == 6) {
    where += ' AND test_user_score_hackland IS NOT NULL'
  } else if (data.testUserScoreHackland == 7) {
    where += ' AND test_user_score_hackland IS NULL'
  }

  if (data.testSystemScoreHackland == 1) {
    where += ' AND test_system_score_hackland>=0 AND test_system_score_hackland<=30'
  } else if (data.testSystemScoreHackland == 2) {
    where += ' AND test_system_score_hackland>30 AND test_system_score_hackland<=60'
  } else if (data.testSystemScoreHackland == 3) {
    where += ' AND test_system_score_hackland>60 AND test_system_score_hackland<=100'
  } else if (data.testSystemScoreHackland == 4) {
    where += ' AND test_system_score_hackland>=0 AND test_system_score_hackland<100'
  } else if (data.testSystemScoreHackland == 5) {
    where += ' AND test_system_score_hackland=100'
  } else if (data.testSystemScoreHackland == 6) {
    where += ' AND test_system_score_hackland IS NOT NULL'
  } else if (data.testSystemScoreHackland == 7) {
    where += ' AND test_system_score_hackland IS NULL'
  }

  if (data.quizAnswer == 1) {
    where += ' AND quiz_answer="num = max_num"'
  } else if (data.quizAnswer == 2) {
    where += ' AND quiz_answer="max_num += 1"'
  } else if (data.quizAnswer == 3) {
    where += ' AND quiz_answer="max_num = num"'
  } else if (data.quizAnswer == 4) {
    where += ' AND quiz_answer="max_num += num"'
  } else if (data.quizAnswer == 5) {
    where += ' AND quiz_answer="" AND profession<>"I am a Software Engineer" AND profession<>""'
  } else if (data.quizAnswer == 6) {
    where += ' AND quiz_answer=""'
  }

  if (data.adsSite != '') {
    where += ' AND s_param="' + data.adsSite + '"'
  }

  if (data.campaignName != '') {
    where += ' AND n_param="' + data.campaignName + '"'
  }

  if (data.searchParam !== '' && data.searchValue !== '') {
    if (data.searchParam.substring(0,1) === 'l') {
      if (data.searchParam !== 'logged_in_google' || data.searchParam !== 'logged_in_facebook' || data.searchParam !== 'last_name') {
        where += ` AND ${table.LINKEDIN_LIST}.${data.searchParam} LIKE "%${data.searchValue}%"`
      }
    } else if (data.searchParam.substring(0,1) === 'f') {
      if (data.searchParam !== 'first_name') {
        where += ` AND ${table.FACEBOOK_LIST}.${data.searchParam} LIKE "%${data.searchValue}%"`
      }
    } else if (data.searchParam.substring(0,1) === 'o') {
      where += ` AND ${table.GOOGLE_LIST}.${data.searchParam} LIKE "%${data.searchValue}%"`
    } else if (data.searchParam.substring(0,1) === 'g') {
      where += ` AND ${table.GITHUB_LIST}.${data.searchParam} LIKE "%${data.searchValue}%"`
    } else if (data.searchParam === 'challenge_name') {
      if (!isVisitHistory) {
        where += ` AND ${table.CHALLENGE_TYPE}.${data.searchParam} LIKE "%${data.searchValue}%"`
      }
    } else {
      if (isVisitHistory) {
        where += ` AND ${table.VISIT_LIST}.${data.searchParam} LIKE "%${data.searchValue}%"`
      } else {
        where += ` AND ${table.SUBMIT_LIST}.${data.searchParam} LIKE "%${data.searchValue}%"`
      }
    }
  } 

  return where
}

/**
 * Function that get visit history
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  object if success returns object else returns message
 */
function getVisitHistory(data) {
  let query = `SELECT count(*) AS count 
    FROM ${table.VISIT_LIST} 
    LEFT JOIN ${table.LINKEDIN_LIST} ON ${table.LINKEDIN_LIST}.luid = ${table.VISIT_LIST}.uid 
    LEFT JOIN ${table.GOOGLE_LIST} ON ${table.GOOGLE_LIST}.ouid = ${table.VISIT_LIST}.uid 
    LEFT JOIN ${table.FACEBOOK_LIST} ON ${table.FACEBOOK_LIST}.fuid = ${table.VISIT_LIST}.uid 
    LEFT JOIN ${table.GITHUB_LIST} ON ${table.GITHUB_LIST}.guid = ${table.VISIT_LIST}.uid`
  query += generalModel.getContactSearchQuery(data, true)

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let count = 0
        if (rows.length > 0) {
          count = rows[0].count
        }

        let query = `SELECT ${table.VISIT_LIST}.*, ${table.LINKEDIN_LIST}.*, ${table.GOOGLE_LIST}.*, ${table.FACEBOOK_LIST}.*, ${table.GITHUB_LIST}.* 
          FROM ${table.VISIT_LIST} 
          LEFT JOIN ${table.LINKEDIN_LIST} ON ${table.LINKEDIN_LIST}.luid = ${table.VISIT_LIST}.uid 
          LEFT JOIN ${table.GOOGLE_LIST} ON ${table.GOOGLE_LIST}.ouid = ${table.VISIT_LIST}.uid 
          LEFT JOIN ${table.FACEBOOK_LIST} ON ${table.FACEBOOK_LIST}.fuid = ${table.VISIT_LIST}.uid 
          LEFT JOIN ${table.GITHUB_LIST} ON ${table.GITHUB_LIST}.guid = ${table.VISIT_LIST}.uid`
        query += generalModel.getContactSearchQuery(data, true)
        query += ` ORDER BY ${table.VISIT_LIST}.uid DESC, ${table.VISIT_LIST}.visit_number ASC`
                
        if (data.page != -1 && data.rowsPerPage != -1) {
          query += ` LIMIT ${data.page * data.rowsPerPage}, ${data.rowsPerPage}`
        }

        db.query(query, (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
            resolve({ count: count, rows: rows })
          }
        })
      }
    })
  })
}

/**
 * Function that get challenge list
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  object if success returns object else returns message
 */
function getChallengeList(data) {
  let query = `SELECT count(*) AS count 
    FROM ${table.CHALLENGE_LIST} 
    LEFT JOIN ${table.SUBMIT_LIST} ON ${table.SUBMIT_LIST}.uid = ${table.CHALLENGE_LIST}.uid 
    LEFT JOIN ${table.CHALLENGE_TYPE} ON ${table.CHALLENGE_TYPE}.id = ${table.CHALLENGE_LIST}.challenge_type`
  query += generalModel.getChallengeSearchQuery(data)

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let count = 0
        if (rows.length > 0) {
          count = rows[0].count
        }

        let query = `SELECT ${table.CHALLENGE_LIST}.*, ${table.CHALLENGE_LIST}.challenge_name As challenge_sub_name, ${table.CHALLENGE_TYPE}.challenge_name, ${table.SUBMIT_LIST}.first_name, ${table.SUBMIT_LIST}.last_name, ${table.SUBMIT_LIST}.email, ${table.SUBMIT_LIST}.user_country 
          FROM ${table.CHALLENGE_LIST} 
          LEFT JOIN ${table.SUBMIT_LIST} ON ${table.SUBMIT_LIST}.uid = ${table.CHALLENGE_LIST}.uid 
          LEFT JOIN ${table.CHALLENGE_TYPE} ON ${table.CHALLENGE_TYPE}.id = ${table.CHALLENGE_LIST}.challenge_type`
        query += generalModel.getChallengeSearchQuery(data)
        query += ` ORDER BY ${table.CHALLENGE_LIST}.uid DESC, ${table.CHALLENGE_LIST}.updated_date DESC`
                
        if (data.page != -1 && data.rowsPerPage != -1) {
          query += ` LIMIT ${data.page * data.rowsPerPage}, ${data.rowsPerPage}`
        }

        db.query(query, (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
            resolve({ count: count, rows: rows })
          }
        })
      }
    })
  })
}

function getChallengeSearchQuery(data) {
  let where = ` WHERE ${table.CHALLENGE_LIST}.uid>0`

  if (data.startDate !== '') {
    where += ` AND Date(${table.CHALLENGE_LIST}.updated_date)>="${data.startDate}"`
  }

  if (data.endDate !== '') {
    where += ` AND Date(${table.CHALLENGE_LIST}.updated_date)<="${data.endDate}"`
  }
  
  if (data.sendDate !== '') {
    where += ` AND Date(${table.CHALLENGE_LIST}.send_date)="${data.sendDate}"`
  }

  if (data.sourceCode == 1) {
    where += ` AND ${table.CHALLENGE_LIST}.source_code<>""`
  } else if (data.sourceCode == 2) {
    where += ` AND ${table.CHALLENGE_LIST}.source_code=""`
  }

  if (data.hostLink == 1) {
    where += ` AND ${table.CHALLENGE_LIST}.host_link<>""`
  } else if (data.hostLink == 2) {
    where += ` AND ${table.CHALLENGE_LIST}.host_link=""`
  }

  if (data.searchParam !== '' && data.searchValue !== '') {
    if (data.searchParam === 'challenge_name') {
      where += ` AND ${table.CHALLENGE_TYPE}.${data.searchParam} LIKE "%${data.searchValue}%"`
    } else if (data.searchParam === 'first_name' || data.searchParam === 'last_name' || data.searchParam === 'email' || data.searchParam === 'user_country') {
      where += ` AND ${table.SUBMIT_LIST}.${data.searchParam} LIKE "%${data.searchValue}%"`
    } else {
      where += ` AND ${table.CHALLENGE_LIST}.${data.searchParam} LIKE "%${data.searchValue}%"`
    }
  } 

  return where
}

/**
 * Function that get challenge log list
 *
 * @author  YingTuring <ying@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  object if success returns object else returns message
 */
function getChallengeLogList(data) {
  let query = `SELECT count(*) AS count 
    FROM ${table.CHALLENGE_LIST} 
    LEFT JOIN ${table.SUBMIT_LIST} ON ${table.SUBMIT_LIST}.uid = ${table.CHALLENGE_LIST}.uid 
    LEFT JOIN ${table.CHALLENGE_TYPE} ON ${table.CHALLENGE_TYPE}.id = ${table.CHALLENGE_LIST}.challenge_type
    LEFT JOIN ${table.CHALLENGE_LIST_LOG} ON ${table.CHALLENGE_LIST_LOG}.cid = ${table.CHALLENGE_LIST}.id`
  query += generalModel.getChallengeLogSearchQuery(data)

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let count = 0
        if (rows.length > 0) {
          count = rows[0].count
        }

        let query = `SELECT ${table.CHALLENGE_LIST}.*, ${table.CHALLENGE_LIST}.challenge_name As challenge_sub_name, ${table.CHALLENGE_TYPE}.challenge_name, ${table.SUBMIT_LIST}.first_name, ${table.SUBMIT_LIST}.last_name, ${table.SUBMIT_LIST}.email,
          ${table.CHALLENGE_LIST_LOG}.error_log, ${table.CHALLENGE_LIST_LOG}.trace 
          FROM ${table.CHALLENGE_LIST} 
          LEFT JOIN ${table.SUBMIT_LIST} ON ${table.SUBMIT_LIST}.uid = ${table.CHALLENGE_LIST}.uid 
          LEFT JOIN ${table.CHALLENGE_TYPE} ON ${table.CHALLENGE_TYPE}.id = ${table.CHALLENGE_LIST}.challenge_type
          LEFT JOIN ${table.CHALLENGE_LIST_LOG} ON ${table.CHALLENGE_LIST_LOG}.cid = ${table.CHALLENGE_LIST}.id`

        query += generalModel.getChallengeLogSearchQuery(data)
        query += ` ORDER BY ${table.CHALLENGE_LIST}.uid DESC, ${table.CHALLENGE_LIST}.created_date DESC`
                
        if (data.page != -1 && data.rowsPerPage != -1) {
          query += ` LIMIT ${data.page * data.rowsPerPage}, ${data.rowsPerPage}`
        }

        db.query(query, (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
            resolve({ count: count, rows: rows })
          }
        })
      }
    })
  })
}

function getChallengeLogSearchQuery(data) {
  let where = ` WHERE ${table.CHALLENGE_LIST}.uid>0 And ${table.CHALLENGE_LIST_LOG}.error_log<>"Deploy Success" And ${table.CHALLENGE_LIST_LOG}.error_log<>""`

  if (data.stackTrace == 1) {
    where += ` AND ${table.CHALLENGE_LIST_LOG}.trace<>""`
  } else if (data.stackTrace == 2) {
    where += ` AND ${table.CHALLENGE_LIST_LOG}.trace=""`
  }

  if (data.errorMessage != '') {
    where += ` AND ${table.CHALLENGE_LIST_LOG}.error_log like "%${data.errorMessage}%"`
  }
  
  return where
}

/**
 * Function that get challenge top errors
 *
 * @author  YingTuring <ying@turing.com>
 * @param   data   page, rowsPerPage and search query informations
 * @return  object if success returns object else returns message
 */
function getChallengeTopErrors(data) {
  let query = `SELECT COUNT(*) AS error_count, error_log from ${table.CHALLENGE_LIST_LOG} WHERE error_log<>"Deploy Success" And error_log<>"" GROUP BY error_log ORDER BY error_count DESC`
  
  if (data.page != -1 && data.rowsPerPage != -1) {
    query += ` LIMIT ${data.page * data.rowsPerPage}, ${data.rowsPerPage}`
  }

  return new Promise((resolve, reject) => {
    db.query(query, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let count = 0
        if (rows.length > 0) {
          count = rows.length
          var results = []
          for (let i=0; i < rows.length; i++) {
            var itemData = {id: i+1, count: rows[i].error_count, log: rows[i].error_log}
            results.push(itemData)
          }
          resolve({ count: count, rows: results })
        }
      }
    })
  })
}

module.exports = generalModel
