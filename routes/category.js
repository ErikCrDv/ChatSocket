const { Router } = require('express');
const { check } = require('express-validator');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/category');
const { categoryExistsById } = require('../helpers/db-validators');
const { isAdminRole } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', getCategories );

router.get('/:id', [
    check('id', 'No es un ID Mongo').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], getCategory);

router.post('/',[
    validateJWT,
    check('name', 'Name is Required!').not().isEmpty(),
    validateFields
], createCategory);

router.put('/:id', [
        validateJWT,
        isAdminRole,
        check('name', 'Name required!').not().isEmpty(),
        check('id', 'No es un ID Mongo').isMongoId(),
        check('id').custom( categoryExistsById ),
        validateFields
], updateCategory);

router.delete('/:id', [
        validateJWT,
        isAdminRole,
        check('id', 'No es un ID Mongo').isMongoId(),
        check('id').custom( categoryExistsById ),
        validateFields
], deleteCategory);



module.exports = router;