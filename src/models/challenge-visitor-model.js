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
var message = require('../constants/message')

var challengeVisitorModel = {
  saveVisit: saveVisit
}

/**
 * Function that send email templete. 
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object data
 * @return  object if success returns object else returns message.
 */
function saveVisit(data, uploadedDate) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT visit_count FROM '+table.CHALLENGE_VISITOR+' WHERE  email = ? AND client = ? AND challenge_type_id = ?';
    db.query(query, [data.email, data.client, data.challengeTypeId], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if(rows.length > 0){
          let updateQuery = 'UPDATE ' + table.CHALLENGE_VISITOR + ' SET visit_count = visit_count + 1 WHERE email = ? AND client = ? AND challenge_type_id = ?';
          db.query(updateQuery, [data.email, data.client, data.challengeTypeId], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              resolve(true)
            }
          })
        }else{
          let saveQuery = 'INSERT INTO ' + table.CHALLENGE_VISITOR + '(email, client, visit_count, challenge_type_id) VALUES (?, ?, 1, ?)';
          db.query(saveQuery, [data.email, data.client, data.challengeTypeId], (error, rows, fields) => {
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


module.exports = challengeVisitorModel
