const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFile } = require('../middlewares');
const { uploadFile, updateImg, getFile, updateImgCloudinary } = require('../controllers/upload');
const { allowedCollections } = require('../helpers');

const router = Router();


router.get('/:collection/:id', [
    check('id', 'No es un MongoId').isMongoId(),
    check( 'collection' ).custom( c => allowedCollections( c, ['users', 'products'] ) ),
    validateFields
], getFile);

router.post('/', validateFile, uploadFile);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'No es un MongoId').isMongoId(),
    check( 'collection' ).custom( c => allowedCollections( c, ['users', 'products'] ) ),
    validateFields
], updateImgCloudinary);
// ], updateImg);

module.exports = router;