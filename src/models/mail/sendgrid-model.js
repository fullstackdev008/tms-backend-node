const btoa = require("btoa");
const uniqid = require("uniqid");
const client = require("@sendgrid/client");
const mailConfig = require("../../config/mail-config");
const keyConfig = require("../../config/key-config");
const Cryptr = require('cryptr');
const path = require('../../constants/path')

const cryptr = new Cryptr(keyConfig.CRYPTR_SECRET_KEY);

client.setApiKey(mailConfig.SENDGRID.apiKey);
const request = {
  method: "GET",
  url: "/v3/api_keys"
};

client.setDefaultRequest("baseUrl", mailConfig.SENDGRID.baseUrl);

/**
 * Sendgrid model file
 *
 * @package   backend/src/models/mail
 * @author    Zecharias <zecharias.a@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var sendGridModel = {
  send: send, 
  sendGeneric: sendGeneric
};

/**
 * Function that send email templete.
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   string sender
 * @param   [obj] receivers
 * @param   string template
 * @param   string senderName
 * @return  object if success returns object else returns message.
 */

function send(sender, recipients, subject, template, senderName, unsubscribeHeader = "", categories=[]) {

  if (sender === "") {
    sender = "challenges@" + mailConfig.SENDGRID.domain;
  }

  if (unsubscribeHeader === "") {
    unsubscribeHeader = "<mailto:unsubscribe@turing.website?subject=List-Unsubscribe>";
  }

  var personalizations = [];

  var receivers

  if (!Array.isArray(recipients)) {
    receivers = [recipients]
  } else {
    receivers = recipients
  }

  for (let i = 0; i < receivers.length; i++) {
    let uniq_id = uniqid();
    let date = new Date();
    let timestamp = date.getTime();
    let base36 = timestamp.toString(36);
    let msg_id = "<" + uniq_id + base36 + "@" + mailConfig.SENDGRID.domain + ">";
    var mailData

    let personalization = {
      to: [
        {
          email: receivers[i].email,
          name: receivers[i].first_name
        }
      ],
      subject: subject,
      substitutions: {
        "-first_name-": receivers[i].first_name,
        "-email-": btoa(receivers[i].email),
        "-yes-": btoa("yes"),
        "-no-": btoa("no"),
        "-cryptEmail-": cryptr.encrypt(receivers[i].email)
      },
      headers: {
        "Message-ID": msg_id,
        "List-Unsubscribe": unsubscribeHeader,
        Precedence: "bulk"
      }
    };
    personalizations.push(personalization);

    template = rewriteLinksInHTML(template)

    mailData = {
      personalizations: personalizations,
      content: [
        {
          type: "text/plain",
          value: template
        },
        {
          type: "text/html",
          value: template
        }
      ],
      from: {
        email: sender,
        name: senderName
      }, 
      categories: categories
    };

  }

  return new Promise((resolve, reject) => {
    request.body = mailData;
    request.method = 'POST';
    request.url = '/v3/mail/send';
    client.request(request)
      .then(([response, body]) => {
        console.log(response.statusCode);
        resolve(true);
      }).catch(err => {
        console.log(err);
        resolve(false);
      });
  });
}

/**
 * Function that send generic email for sendgrid.
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   string sender
 * @param   [obj] receivers
 * @param   string template
 * @param   string senderName
 * @return  object if success returns object else returns message.
 */

function sendGeneric(sender, recipients, subject, template, senderName, unsubscribeHeader = "", categories=[]) {

  if (sender === "") {
    sender = "challenges@" + mailConfig.SENDGRID.domain;
  }

  if (unsubscribeHeader === "") {
    unsubscribeHeader = "<mailto:unsubscribe@turing.website?subject=List-Unsubscribe>";
  }

  var personalizations = [];

  var receivers

  if (!Array.isArray(recipients)) {
    receivers = [recipients]
  } else {
    receivers = recipients
  }

  for (let i = 0; i < receivers.length; i++) {
    let uniq_id = uniqid();
    let date = new Date();
    let timestamp = date.getTime();
    let base36 = timestamp.toString(36);
    let msg_id = "<" + uniq_id + base36 + "@" + mailConfig.SENDGRID.domain + ">";
    var mailData

    let personalization = {
      to: [
        {
          email: receivers[i].email,
          name: receivers[i].name
        }
      ],
      subject: subject,
      substitutions: {
        "-name-": receivers[i].name,
        "-email-": receivers[i].email,
        "-link-": receivers[i].link,
      },
      headers: {
        "Message-ID": msg_id,
        "List-Unsubscribe": unsubscribeHeader,
        Precedence: "bulk"
      }
    };
    personalizations.push(personalization);

    template = rewriteLinksInHTML(template)

    mailData = {
      personalizations: personalizations,
      content: [
        {
          type: "text/plain",
          value: template
        },
        {
          type: "text/html",
          value: template
        }
      ],
      from: {
        email: sender,
        name: senderName
      }, 
      categories: categories
    };

  }

  return new Promise((resolve, reject) => {
    request.body = mailData;
    request.method = 'POST';
    request.url = '/v3/mail/send';
    client.request(request)
      .then(([response, body]) => {
        resolve(response);
      }).catch(err => {
        resolve(false);
      });
  });
}


function rewriteLinksInHTML(html) {
    
  var regex = /href\s*=\s*(['"])(https?:\/\/.+?)\1/ig;   
  var link;
  
  while((link = regex.exec(html)) !== null) {
    html = html.replace(link[2], path.BASE_URL + 'analytics?tm=-email-&rd=' + encodeURIComponent(link[2]));
  }
  
  return html;
  
}

module.exports = sendGridModel;
