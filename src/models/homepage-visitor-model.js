/**
 * challenge visitor model file
 *
 * @package   backend/src/models/mail
 * @author    Zecharias <zecharias.a@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var table = require('../constants/table')
var db = require('../database/database')
var message  = require('../constants/message')

var homepageVisitorModel = {
  saveResponse: saveResponse,
  saveEmailRequest: saveEmailRequest
}

/**
 * Function that saves response to invitation email. 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object data
 * @return  object if success returns object else returns message.
 */
function saveResponse(data, uploadedDate) {
  return new Promise((resolve, reject) => {
    // resolve({ visitorData: data})
    const query = 'SELECT visit_count FROM '+table.HOMEPAGE_VISITOR+' WHERE  email = ?';
    db.query(query, [data.email], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if(rows.length > 0){
          let updateQuery = 'UPDATE ' + table.HOMEPAGE_VISITOR + ' SET response = ?, visit_count = visit_count + 1 WHERE email = ?';
          db.query(updateQuery, [data.response, data.email], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        } else {
          let saveQuery = 'INSERT INTO ' + table.HOMEPAGE_VISITOR + '(email, response, visit_count) VALUES (?, ?, 1)';
          db.query(saveQuery, [data.email, data.response], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }
      }
    });
  })    
}

/**
 * Function that saves email requests made
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object data
 * @return  object if success returns object else returns message.
 */
function saveEmailRequest(data, uploadedDate) {
  return new Promise((resolve, reject) => {
    // resolve({ visitorData: data})
    const query = 'SELECT id FROM ' + table.HOMEPAGE_VISITOR + ' WHERE  email = ?';
    db.query(query, [data.email], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if(rows.length > 0){
          let updateQuery = 'UPDATE ' + table.HOMEPAGE_VISITOR + ' SET email_requests = email_requests + 1 WHERE email = ?';
          db.query(updateQuery, [data.email], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        } else {
          let saveQuery = 'INSERT INTO ' + table.HOMEPAGE_VISITOR + '(email) VALUES (?)';
          db.query(saveQuery, [data.email], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }
      }
    })
  })    
}


module.exports = homepageVisitorModel
