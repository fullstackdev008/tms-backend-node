const bcrypt = require('bcrypt-nodejs');
const db = require('../database/database');
const table = require('../constants/table');
const message = require('../constants/message');
const pdf = require('html-pdf');
var pug = require('./mail/pug-helper-model').compile;

const getUserDetail = (email, password) => {
  const query = `SELECT
    USER.id AS id,
    USER.fb_id AS fbId,
    USER.google_id AS googleId,
    USER.email AS email,
    USER.full_name AS fullName,
    USER.created_date AS createdDate,
    USER.password AS password
    FROM ${table.USER_LIST} AS USER
    WHERE email = ?`;
  
  return new Promise((resolve, reject) => {
    db
    .query(query, [email], (error, rows) => {
      if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR });
        } else {
          if (rows.length > 0) {
            // compare password
            if (rows[0].password) {
              bcrypt.compare(password, rows[0].password, (error, result) => {
                if (error) {
                  reject({ message: message.INVALID_PASSWORD });
                } else if (result) {
                  delete rows[0].password;
                  resolve(rows[0]);
                } else {
                  reject({ message: message.INVALID_PASSWORD });
                }
              });
            } else {
              reject({ message: 'Password not set for user' });
            }
            
          } else {
            reject({ message: message.DATA_NOT_EXIST });
          }
        }
      });
  });
};

const getUserResume = async (id) => {
  const userInfoQuery = `SELECT ${table.SUBMIT_LIST}.phone_number, ${table.USER_LIST}.full_name, ${table.DEVELOPER_DETAIL}.avatar, ${table.USER_LIST}.email, ${table.DEVELOPER_DETAIL}.country, ${table.DEVELOPER_DETAIL}.role, ${table.DEVELOPER_DETAIL}.years_of_experience, ${table.DEVELOPER_DETAIL}.years_of_working_remotely, ${table.TPM_DEVELOPER_WORKING_HOURS}.time_from, ${table.TPM_DEVELOPER_WORKING_HOURS}.time_to  FROM ${table.SUBMIT_LIST} LEFT JOIN ${table.USER_LIST} ON ${table.SUBMIT_LIST}.uid = ${table.USER_LIST}.id LEFT JOIN ${table.DEVELOPER_DETAIL} ON ${table.USER_LIST}.id = ${table.DEVELOPER_DETAIL}.user_id LEFT JOIN ${table.TPM_DEVELOPER_WORKING_HOURS} ON ${table.USER_LIST}.id = ${table.TPM_DEVELOPER_WORKING_HOURS}.developer_id  WHERE ${table.USER_LIST}.id = ? `
  const skillsQuery = `SELECT ${table.DEVELOPER_SKILLS}.*, ${table.BASE_ALL_SKILLS}.skill_name, ${table.SKILL_TYPES}.display_name as skill_type FROM ${table.DEVELOPER_SKILLS} JOIN ${table.BASE_ALL_SKILLS} ON ${table.DEVELOPER_SKILLS}.skill_id = ${table.BASE_ALL_SKILLS}.id JOIN ${table.SKILL_TYPES} ON ${table.BASE_ALL_SKILLS}.skill_type_id = ${table.SKILL_TYPES}.id WHERE developer_id = ? ORDER BY skill_type, score DESC`
  const experienceQuery = `SELECT * FROM ${table.DEVELOPER_EXPERIENCE} WHERE developer_id = ?`;
  const projectsQuery = `SELECT * FROM ${table.DEVELOPER_PROJECT} WHERE developer_id = ?`;
  const educationQuery = `SELECT * FROM ${table.DEVELOPER_EDUCATION} WHERE developer_id = ?`;
  const certificationsQuery = `SELECT ${table.DEVELOPER_CERTIFICATION}.*, ${table.CERTIFICATIONS}.name FROM ${table.DEVELOPER_CERTIFICATION} JOIN ${table.CERTIFICATIONS} ON ${table.DEVELOPER_CERTIFICATION}.certification_id = ${table.CERTIFICATIONS}.id WHERE developer_id = ? ORDER BY year DESC`
  const allQueries = userInfoQuery + ';' + skillsQuery + ';' + experienceQuery + ';' + projectsQuery + ';' + educationQuery + ';' + certificationsQuery + ';';
  return new Promise((resolve, reject) => {
    db.query(allQueries, [id, id, id, id, id, id], (error, rows) => {
      if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR });
        } else {
          info = rows[0][0];
          let gcsUrl = process.env.ENV === 'production' ? process.env.PROD_GCS_BUCKET_URL : process.env.DEV_GCS_BUCKET_URL;
          info['avatar'] = info['avatar'] === '' || !info['avatar'] ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : gcsUrl + '/avatar/' + info['avatar'];
          if (rows.length > 0) {
            let skills = {}
            let index = ''
            for (let i = 0; i < rows[1].length; i++) {
              let row = rows[1][i]
              if(row.skill_type !== index) index = row.skill_type;
              if(!skills[index]) skills[index] = []
              skills[index].push(row)
            }

            let experience = rows[2]
            for (let i = 0; i < experience.length; i++) {
              experience[i].details = experience[i].details.split('\n');
            }

            let projects = rows[3]
            for (let i = 0; i < projects.length; i++) {
              projects[i].details = projects[i].details.split('\n');
            }
            console.log(info.avatar)
            pug("user_resume", { userInfo: info, userSkills: skills, userExperience: experience, userProjects: projects, userEducation: rows[4], userCertifications: rows[5] }, function (content) {
              var options = { 
                format: 'Letter',
                border: {
                  top: '1in',
                  right: '1in',
                  bottom: '1in',
                  left: '1in'
                } 
              };
              pdf.create(content, options).toBuffer(function(err, buffer) {
                if (err) {
                  reject({ message: message.INTERNAL_SERVER_ERROR, error: err})
                } else {
                  resolve(buffer);
                }
              });
            })
          }
        }
      });
  });
};

const getResumePlainList = (type, keyword, count) => {
  let mode = parseInt(type) === 0 ? 'IN NATURAL LANGUAGE MODE' : 'IN BOOLEAN MODE';
  const query = `SELECT id, user_id, resume, resume_plain, MATCH (resume_plain) AGAINST (? ${mode}) AS score FROM ${table.DEVELOPER_DETAIL} WHERE MATCH (resume_plain) AGAINST (? ${mode}) LIMIT ${count}`;
  
  return new Promise((resolve, reject) => {
    db.query(query, [keyword, keyword], (error, rows) => {
      if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR });
        } else {
          if (rows.length > 0) {
            resolve(rows);
          } else {
            reject({ message: message.DATA_NOT_EXIST });
          }
        }
      });
  });
};

const userModel = {
  getUserDetail,
  getUserResume,
  getResumePlainList
};

module.exports = userModel;
