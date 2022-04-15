const dbValidators = require('./db-validators');
const generateJwt = require('./generate-jwt');
const googleVerify = require('./google-verify');
const fileUpload = require('./file-upload');

module.exports = {
    ...dbValidators,
    ...generateJwt,
    ...googleVerify,
    ...fileUpload
}