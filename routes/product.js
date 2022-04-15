const { Router } = require('express');
const { check } = require('express-validator');


const { 
    getProducts, 
    getProduct, 
    createProduct, 
    deleteProduct, 
    updateProduct 
} = require('../controllers/product');

const { productExistsById, categoryExistsById } = require('../helpers/db-validators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const router = Router();


router.get('/', getProducts );

router.get('/:id', [
    check('id', 'No es un ID Mongo').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
], getProduct);

router.post('/', [
    validateJWT,
    check('name', 'Name is Required').not().isEmpty(),
    check('category', 'No es un Category ID Mongo').isMongoId(),
    check('category').custom( categoryExistsById ),
    validateFields,
], createProduct );

router.put('/:id', [
    validateJWT,
    isAdminRole,
    // check('category', 'No es un Category ID Mongo').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
], updateProduct);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID Mongo').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields,
], deleteProduct );

module.exports = router;