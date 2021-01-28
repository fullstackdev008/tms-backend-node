const fs = require('fs');
var code  = require('../constants/code');
const { Storage } = require('@google-cloud/storage');

const dotenv = require('dotenv');
dotenv.config();

exports.uploadResume2GCS = (resumeFile) => {
  return new Promise((resolve, reject) => {
    let targetDir = 'public/upload/resume/';
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    if (resumeFile.size > (1024 * 1024 * 10)) {
      error = new Error('The maximum allowed file size is 10 MB.');
      error.status = code.INVALID_INPUT_PARAMS;
      reject(error)
    }

    let allowedTypes = [
      'application/pdf',
      'application/wps-office.pdf',
      'application/wps-office.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const fileAllowed = allowedTypes.includes(resumeFile.mimetype);

    if (!fileAllowed) {
      error = new Error('This type of file is not allowed');
      error.status = code.INVALID_INPUT_PARAMS;
      reject(error)
    } else {
      let fileName = Date.now() + '_' + resumeFile.name
      resumeFile.mv(targetDir + fileName, function (err) {
        if (err){
          reject(err)
        } else {
          const storage = new Storage({
            projectId: process.env.GCS_PROJECT_ID,
            keyFilename: process.env.GCS_KEY_FILE,
          });
          let bucket = storage.bucket(process.env.GCS_BUCKET_NAME)
          let destFile = process.env.ENV === 'production' ? `resume/${fileName}` : `development/resume/${fileName}`
          let file = bucket.file(destFile)

          const options = {
            destination: destFile
          };

          bucket.upload(targetDir + fileName, options)
            .then(() => file.makePublic())
            .then(() => resolve(fileName));
        }
      });
    }
  });
}

exports.uploadAvatar2GCS = (avatarFile) => {
  return new Promise((resolve, reject) => {
    let targetDir = 'public/upload/avatar/';
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    if (avatarFile.size > (1024 * 1024 * 4)) {
      error = new Error('The maximum allowed file size is 4 MB.');
      error.status = code.INVALID_INPUT_PARAMS;
      reject(error)
    }

    let allowedTypes = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/bmp',
      'image/gif',
      'image/pipeg',
      'image/svg+xml'
    ];
    const fileAllowed = allowedTypes.includes(avatarFile.mimetype);

    if (!fileAllowed) {
      error = new Error('This type of file is not allowed');
      error.status = code.INVALID_INPUT_PARAMS;
      reject(error)
    } else {
      let fileName = Date.now() + '_' + avatarFile.name
      avatarFile.mv(targetDir + fileName, function (err) {
        if (err){
          reject(err)
        } else {
          const storage = new Storage({
            projectId: process.env.GCS_PROJECT_ID,
            keyFilename: process.env.GCS_KEY_FILE,
          });
          let bucket = storage.bucket(process.env.GCS_BUCKET_NAME)
          let destFile = process.env.ENV === 'production' ? `avatar/${fileName}` : `development/avatar/${fileName}`
          let file = bucket.file(destFile)

          const options = {
            destination: destFile
          };

          bucket.upload(targetDir + fileName, options)
            .then(() => file.makePublic())
            .then(() => resolve(fileName));
        }
      });
    }
  });
}

exports.uploadSystemDesign2GCS = (answerFile) => {
  return new Promise((resolve, reject) => {
    let targetDir = 'public/upload/system_design/';
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    if (answerFile.size > (1024 * 1024 * 10)) {
      error = new Error('The maximum allowed file size is 10 MB.');
      error.status = code.INVALID_INPUT_PARAMS;
      reject(error)
    }

    let allowedTypes = [
      'application/pdf',
      'application/wps-office.pdf',
      'application/wps-office.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const fileAllowed = allowedTypes.includes(answerFile.mimetype);

    if (!fileAllowed) {
      error = new Error('This type of file is not allowed');
      error.status = code.INVALID_INPUT_PARAMS;
      reject(error)
    } else {
      let fileName = Date.now() + '_' + answerFile.name
      answerFile.mv(targetDir + fileName, function (err) {
        if (err){
          reject(err)
        } else {
          const storage = new Storage({
            projectId: process.env.GCS_PROJECT_ID,
            keyFilename: process.env.GCS_KEY_FILE,
          });
          let bucket = storage.bucket(process.env.GCS_BUCKET_NAME)
          let destFile = process.env.ENV === 'production' ? `system_design/${fileName}` : `development/system_design/${fileName}`
          let file = bucket.file(destFile)

          const options = {
            destination: destFile
          };

          bucket.upload(targetDir + fileName, options)
          .then(() => file.makePublic())
          .then(() => resolve(fileName));
        }
      });
    }
  });
}

exports.uploadProductDesign2GCS = (answerFile) => {
  return new Promise((resolve, reject) => {
    let targetDir = 'public/upload/product_design/';
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    if (answerFile.size > (1024 * 1024 * 10)) {
      error = new Error('The maximum allowed file size is 10 MB.');
      error.status = code.INVALID_INPUT_PARAMS;
      reject(error)
    }

    let allowedTypes = [
      'application/pdf',
      'application/wps-office.pdf',
      'application/wps-office.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const fileAllowed = allowedTypes.includes(answerFile.mimetype);

    if (!fileAllowed) {
      error = new Error('This type of file is not allowed');
      error.status = code.INVALID_INPUT_PARAMS;
      reject(error)
    } else {
      let fileName = Date.now() + '_' + answerFile.name
      answerFile.mv(targetDir + fileName, function (err) {
        if (err){
          reject(err)
        } else {
          const storage = new Storage({
            projectId: process.env.GCS_PROJECT_ID,
            keyFilename: process.env.GCS_KEY_FILE,
          });
          let bucket = storage.bucket(process.env.GCS_BUCKET_NAME)
          let destFile = process.env.ENV === 'production' ? `product_design/${fileName}` : `development/product_design/${fileName}`
          let file = bucket.file(destFile)

          const options = {
            destination: destFile
          };

          bucket.upload(targetDir + fileName, options)
            .then(() => file.makePublic())
            .then(() => resolve(fileName));
        }
      });
    }
  });
}


exports.handleGetFileDownloadUrl = (fileName, res) => {
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: process.env.GCS_KEY_FILE,
  });
  let bucket = storage.bucket(process.env.GCS_BUCKET_NAME)
  const file = bucket.file(fileName);
  let expirerDate = new Date();
  expirerDate.setDate(expirerDate.getDate() + 2); // next 2 days

  return file.getSignedUrl({
    action: 'read',
    expires: expirerDate
  }).then(signedUrls => {
    res.json({
      success: true, result: signedUrls[0],
    });
  }) // contains the file's public URL)
  .catch(err => res.json({ success: false, errorMessage: codes.BAD_REQUEST }))
}