var axios = require('axios');
const mailConfig = require("../../config/mail-config");

var emailSystemModel = {
  send: send
};

function send(receivers, templateId, replacements, sender = null) {
  let header = {
    'Content-Type': 'application/json',
    'api-key': mailConfig.EMAIL_SYSTEM.apiKey
  }
  let requestObj = {
    receivers: receivers,
    template_id: templateId,
    replacements: replacements
  }
  if(sender) {
    requestObj.sender = sender
  }
  return axios.post(mailConfig.EMAIL_SYSTEM.sendTemplateUrl, requestObj, { headers: header })
}

module.exports = emailSystemModel;