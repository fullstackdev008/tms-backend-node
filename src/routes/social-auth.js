/**
 * Auth social router file
 * 
 * @package   backend/src/routes
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth
 */

var express = require('express')
var router = express.Router()
var socialAuthService = require('../services/social-auth-service');
var authMiddleware = require('../middleware/auth-middleware')
const request = require('superagent')
const apiKey = require('../constants/api')
var randomstring = require("randomstring");
var redirectURL = ''
var callbackURL = ''
var uid = ''

/** 
 * Call LinkedIn OAuth 
 */
router.get('/linkedin/oauth', authMiddleware.checkTokenForLinkedIn, function(req, res){
  callbackURL = req.query.callback
  redirectURL = req.query.redirect
  if (req.decoded === undefined) {
    return res.redirect(redirectURL)
  } else {
    uid = req.decoded.uid
    return res.redirect('https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' + apiKey.LINKEDIN_CLIENT_ID + '&redirect_uri=' + callbackURL + '&state=' + randomstring.generate() + '&scope=r_emailaddress,r_liteprofile')
  }
})

/** 
 * Get callback param from linkedin
 */
router.get('/linkedin/callback',function(req, res){
  var code = req.query.code
  if (code === undefined) {
    return res.redirect(redirectURL)
  } else {
    request
      .post('https://www.linkedin.com/uas/oauth2/accessToken')
      .send({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: callbackURL,
        client_id: apiKey.LINKEDIN_CLIENT_ID,
        client_secret: apiKey.LINKEDIN_CLIENT_SECRET
      })
      .set('content-type', 'application/x-www-form-urlencoded')
      .then((result) => {
          var accessToken = result.body.access_token
          request
            .get('https://api.linkedin.com/v2/me')
            .set('Authorization', 'Bearer ' + accessToken)
            .set('Accept', 'application/json')
            .then((result) => {
                let linkedInData = {
                  firstName: '',
                  lastName: '',
                  id: '',
                  emailAddress: '',
                  errorCode: 'success'
                }
                if (result.body) {
                  linkedInData.firstName = result.body.firstName.localized.en_US
                  linkedInData.lastName = result.body.lastName.localized.en_US
                  linkedInData.id = result.body.id
                } else {
                  return res.redirect(redirectURL)
                }
                request
                  .get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))')
                  .set('Authorization', 'Bearer ' + accessToken)
                  .set('Accept', 'application/json')
                  .then((result) => {
                    if (result.body) {
                      linkedInData.emailAddress = result.body.elements[0]['handle~'].emailAddress
                    } else {
                      return res.redirect(redirectURL)
                    }
                    saveLinkedinData(uid, linkedInData).then((result) => {
                      console.log(result)
                      return res.redirect(redirectURL)
                    })
                  })
                  .catch((err) => {
                    return res.redirect(redirectURL)
                  })
            })
            .catch((err) => {
              return res.redirect(redirectURL)
            })
      })
      .catch((err) => {
        return res.redirect(redirectURL)
      })
  }
})

/** 
 * Login with google user account
 */
router.post('/google/login', authMiddleware.checkTokenForSignup, loginWithGoogle)

/** 
 * Save google account data
 */
router.post('/google/save', authMiddleware.checkToken, saveGoogleData)

/** 
 * Save google failed status
 */
router.post('/google/save-failed', authMiddleware.checkToken, saveGoogleFailedStatus)

/** 
 * Login with facebook user account
 */
router.post('/facebook/login', authMiddleware.checkTokenForSignup, loginWithFacebook)

/** 
 * Save facebook account data
 */
router.post('/facebook/save', authMiddleware.checkToken, saveFacebookData)

/** 
 * Save facebook failed status
 */
router.post('/facebook/save-failed', authMiddleware.checkToken, saveFacebookFailedStatus)

/** 
 * Get linkedin status
 */
router.post('/linkedin/status', authMiddleware.checkToken, saveLinkedinStatus)

/** 
 * Save with github data
 */
router.post('/github/save', authMiddleware.checkToken, saveGithubData)

/**
 * Function that get authorize url from google service
 *
 * @author  DongTuring  <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function loginWithGoogle(req, res) {
  let userInfo = req.body
  let landing = req.landing
  let authData

  if (landing) {
    authData = {
      landing: landing,
      user: userInfo,
      userId: req.decoded.uid
    }
  } else {
    authData = {
      landing: landing,
      user: userInfo
    }
  }
  socialAuthService.loginWithGoogle(authData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save google data 
 *
 * @author  YingTuring  <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveGoogleData(req, res) {
  let userInfo = req.body
  
  if (req.decoded) {
    userData = {
      user: userInfo,
      userId: req.decoded.uid
    }
  }
  
  socialAuthService.saveGoogleData(userData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save google failed status
 *
 * @author  DongTuring  <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveGoogleFailedStatus(req, res) {
  let userInfo = req.body
  
  if (req.decoded) {
    userData = {
      user: userInfo,
      userId: req.decoded.uid
    }
  }
  
  socialAuthService.saveGoogleFailedStatus(userData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that get authorize url from facebook service
 *
 * @author  DongTuring  <dong@turing.com>
 * @return   
 */
function loginWithFacebook(req, res) {
  let userInfo = req.body
  let landing = req.landing
  let authData
  
  if (landing) {
    authData = {
      landing: landing,
      user: userInfo,
      userId: req.decoded.uid
    }
  } else {
    authData = {
      landing: landing,
      user: userInfo
    }
  }
  socialAuthService.loginWithFacebook(authData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save google data 
 *
 * @author  YingTuring  <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveFacebookData(req, res) {
  let userInfo = req.body
  
  if (req.decoded) {
    userData = {
      user: userInfo,
      userId: req.decoded.uid
    }
  }
  
  socialAuthService.saveFacebookData(userData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save facebook failed status
 *
 * @author  DongTuring  <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveFacebookFailedStatus(req, res) {
  let userInfo = req.body
  
  if (req.decoded) {
    userData = {
      user: userInfo,
      userId: req.decoded.uid
    }
  }
  
  socialAuthService.saveFacebookFailedStatus(userData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save linkedin data 
 *
 * @author  DongTuring  <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveLinkedinData(uid, data) { 
  return new Promise((resolve, reject) => { 
    let userData = {
      user: data,
      userId: uid
    }
    socialAuthService.saveLinkedinData(userData).then((result) => {
      resolve(result)
    })
  })
}

/**
 * Function that save linkedin account status 
 *
 * @author  DongTuring  <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveLinkedinStatus(req, res) {
  let data = {
    userId: req.decoded.uid,
    status: req.body.status
  }
  
  socialAuthService.saveLinkedinStatus(data).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that save github data 
 *
 * @author  YingTuring  <ying@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function saveGithubData(req, res) {
  let githubCode = req.body.githubCode
  let githubId = req.body.githubId
  let githubSecret = req.body.githubSecret

  if (req.decoded) {
    userData = {
      code: githubCode,
      githubId: githubId,
      githubSecret: githubSecret,
      userId: req.decoded.uid
    }
  }
  
  socialAuthService.getGithubData(userData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

module.exports = router
