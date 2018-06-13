/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const Image = require('../models/image');

const s3 = new AWS.S3({
  signatureVersion: 'v4',
});

const S3_BUCKECT = 'fortnight-materials';

const uploadToS3 = (req, file, image) => new Promise((resolve, reject) => {
  const storage = multerS3({
    s3,
    bucket: S3_BUCKECT,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (r, f, cb) => {
      cb(null, image.key);
    },
  });
  storage._handleFile(req, file, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

class DatabaseStorage {
  async _handleFile(req, file, cb) {
    const { originalname, mimetype } = file;
    try {
      const image = await Image.create({
        filename: originalname,
        mimeType: mimetype,
      });
      const result = await uploadToS3(req, file, image);
      const { size, location, bucket } = result;

      // Set additional details from the upload response.
      image.set({
        size,
        uploadedAt: new Date(),
        s3: { location, bucket },
      });
      await image.save();

      cb(null, {
        record: image.toObject({ getters: true, virtuals: true }),
        result,
      });
    } catch (e) {
      cb(e);
    }
  }

  _removeFile(req, file, cb) {
    cb(new Error('Removal of files is not yet implemented.'));
  }
}

module.exports = DatabaseStorage;
