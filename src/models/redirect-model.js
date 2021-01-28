/**
 * Redirect model file
 *
 * @package   backend/src/models
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var redirectModel = {
  checkUncompletedPage: checkUncompletedPage,
  checkDevAccount: checkDevAccount,
  checkDevTestPage: checkDevTestPage,
  checkDevExperiencePage: checkDevExperiencePage,
  checkNotDevExperiencePage: checkNotDevExperiencePage,
  devTestHacklandStatus: devTestHacklandStatus,
  checkDevProfilePage: checkDevProfilePage,
  checkJobsPage: checkJobsPage,
  checkDevSkillsPage: checkDevSkillsPage,
  checkDevResumePage: checkDevResumePage,
  checkNotDevPage: checkNotDevPage
}

/**
 * Function that check uncompleted page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   int userId
 * @return  object if success returns object else returns message
 */
function checkUncompletedPage(user) {
  let pageUrl = ''
  let devAccountStatus  = redirectModel.checkDevAccount(user)
  if (!devAccountStatus) {
    pageUrl = 'signup'
    return pageUrl
  }
  if (user.profession === 'I am a software engineer') { /* OMFG - This is incredible */

    let devTestStatus  = redirectModel.checkDevTestPage(user)
    let devExp = redirectModel.checkDevExperiencePage(user)
    // let devTestHacklandStatus  = redirectModel.devTestHacklandStatus(user)
    //let devProfileStatus  = redirectModel.checkDevProfilePage(user)
    //let devJobsStatus  = redirectModel.checkDevProfilePage(user)
    //let devSkillsStatus  = redirectModel.checkDevSkillsPage(user)
    //let devResumeStatus  = redirectModel.checkDevResumePage(user)

    if (devTestStatus && devExp.status) {
      //pageUrl = 'dashboard/challenge'
      pageUrl = 'dashboard/jobList'
    } else if (!devExp.status) {
      pageUrl = devExp.pageUrl
    } else if (!devTestStatus) {
      pageUrl = 'submit/test_choice_javascript'
    }
  } else {
    if (user.profession !== '') {
      // check not dev page completed status
      let notDevExpStatus  = redirectModel.checkNotDevExperiencePage(user)
      //let notDevProfileStatus  = redirectModel.checkDevProfilePage(user)
      //let notDevResumeStatus = redirectModel.checkNotDevPage(user)
      if (notDevExpStatus) {
        //pageUrl = 'dashboard/challenge'
        pageUrl = 'dashboard/jobList'
      } else if (!notDevExpStatus) {
        pageUrl = 'submit/remote_experience'
      }
    }
  }

  return pageUrl
}

/**
 * Check status of dev test page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function checkDevAccount(user) {
  if (user) {
    if ((user.email !== null) && (user.email !== '')) {
      return true
    }
  }

  return false
}

/**
 * Check status of dev test page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function checkDevTestPage(user) {
  if (user) {
    if ((user.test_language !== null) && (user.test_language !== '') && (user.test_user_score_palindrome !== null)) {
      return true
    }
  }

  return false
}

/**
 * Check status of hackland test
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function devTestHacklandStatus(user) {
  if (user) {
    if ((user.test_user_score_hackland !== null)) {
      return true
    }
  }

  return false
}

/**
 * Check status of dev remote-experience page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function checkNotDevExperiencePage(user) {
  if (user) {
    if ((user.remote_hours !== null) && (user.remote_hours !== '')) {
      return true
    }
  }
  return false
}

/**
 * Check status of dev remote-experience page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function checkDevExperiencePage(user) {
  let pageUrl = 'submit/remote_experience'
  let status = false
  let returnVal = {
    status: status,
    pageUrl: pageUrl
  }
  if (user) {
    if ((user.remote_hour !== null) && (user.remote_hour !== '')) {
      returnVal.status = true
    }
  }
  return returnVal
}

/**
 * Check status of dev job page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function checkJobsPage(user) {
  if (user) {
    if ((user.job_names !== null) &&
      (user.job_levels !== null) &&
      (user.job_names !== '') &&
      (user.job_levels !== '')) {
      return true
    }
  }

  return false
}

/**
 * Check status of dev profile page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function checkDevProfilePage(user) {
  if (user) {
    if ((user.first_name != '') && (user.last_name != '')) {
      return true
    }
  }

  return false
}

/**
 * Check status of dev skill page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function checkDevSkillsPage(user) {
    if (user){
      if ((user.skill_names !== '') &&
        (user.skill_names !== null) &&
        (user.skill_levels !== '') &&
        (user.skill_levels !== null)) {
          return true
      }
    }

    return false
}

/**
 * Check status of dev resume page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function checkDevResumePage(user) {
  if (user) {
    if (((user.country !== '') &&
      (user.country !== '-')) ||
      (user.linkedin_url !== '') ||
      (user.recent_employer !== '') ||
      (user.recent_position !== '') ||
      (user.resume !== '')) {
          return true
    }
  }

  return false
}

/**
 * Check status of non-dev resume page
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object user
 * @return  boolean
 */
function checkNotDevPage(user) {
  if (user) {
      if ((user.profession !== '') && (user.profession !== null)) {
          return true
      }
  }

  return false
}

module.exports = redirectModel
