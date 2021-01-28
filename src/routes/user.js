const express = require('express');
const router = express.Router();

const code = require('../constants/code');
const message = require('../constants/message');
const userService = require('../services/user-service');
const { checkAccessToken, checkApiKey } = require('../middleware/api-key-middleware');

const getUserDetail = (req, res) => {
  const { email, password } = req.body;

  let response = { success: false }; // postmatch response format

  if (!email || !password) {
    response = { success: false, error: message.INVALID_INPUT_PARAMS };
    res.json(response);
    return;
  }
  
  userService
    .getUserDetail(email, password)
    .then((result) => {
      response = { success: true, result: result.data };
      res.json(response);
    })
    .catch((err) => {
      response = { success: false, error: err.message };
      res.json(response);
    });
};

function getUserResume(req, res) {
  const { id } = req.params;
  if (!id) {
    res.json({ code: code.INVALID_INPUT_PARAMS, message: message.INVALID_INPUT_PARAMS });
    return;
  }
  
  userService
    .getUserResume(id)
    .then((result) => {
      res.set('Content-disposition', 'attachment; filename=resume.pdf');
      res.contentType("application/pdf");
      res.send(result);
    })
    .catch((err) => {
      res.json(err);
    });
};

const getResumePlainList = (req, res) => {
  const { type, keyword, count } = req.body;

  let response = { success: false };

  if (!type || !keyword || !count) {
    response = { success: false, error: message.INVALID_INPUT_PARAMS };
    res.json(response);
    return;
  }
  
  userService.getResumePlainList(type, keyword, count)
    .then((result) => {
      response = { success: true, result: result.data };
      res.json(response);
    })
    .catch((err) => {
      response = { success: false, error: err.message };
      res.json(response);
    });
};

router.post('/details', checkAccessToken, getUserDetail);
router.get('/resume/:id', checkApiKey, getUserResume);
router.post('/search-resume-plain', checkAccessToken, getResumePlainList);

module.exports = router;
