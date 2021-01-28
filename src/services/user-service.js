const message = require('../constants/message');
const code = require('../constants/code');
const userModel = require('../models/user-model');

const getUserDetail = (email, password) => {
  return new Promise((resolve, reject) => {
    userModel
      .getUserDetail(email, password)
      .then((res) => {
        resolve({ code: code.OK, message: '', data: res });
      })
      .catch((err) => {
        if (err.message === message.INTERNAL_SERVER_ERROR)
          reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} });
        else
          reject({ code: code.BAD_REQUEST, message: err.message, data: {} });
      });
  });
};

const getUserResume = (id) => {
  return new Promise((resolve, reject) => {
    userModel
      .getUserResume(id)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (err.message === message.INTERNAL_SERVER_ERROR)
          reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} });
        else
          reject({ code: code.BAD_REQUEST, message: err.message, data: {} });
      });
  });
};

const getResumePlainList = (type, keyword, count) => {
  return new Promise((resolve, reject) => {
    userModel.getResumePlainList(type, keyword, count)
      .then((res) => {
        resolve({ code: code.OK, message: '', data: res });
      })
      .catch((err) => {
        if (err.message === message.INTERNAL_SERVER_ERROR)
          reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} });
        else
          reject({ code: code.BAD_REQUEST, message: err.message, data: {} });
      });
  });
};

const userService = {
  getUserDetail,
  getUserResume,
  getResumePlainList
};

module.exports = userService;