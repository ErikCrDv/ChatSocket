const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { 
    validateFields, 
    validateJWT, 
    isAdminRole, 
    hasRole 
} = require('../middlewares');

const { isValidRole, emailExists, userExistsById } = require('../helpers/db-validators');
const { 
    userGet, 
    userPost, 
    userPut, 
    userPatch, 
    userDelete 
} = require('../controllers/user');


router.get('/', userGet);

router.post('/', [
    check('name', 'Nombre obligatorio').not().isEmpty(),
    check('email', 'Correo no valido').isEmail(),
    check('password', 'Password debe de contener mas de 6 caracteres').isLength({ min: 6 }),
    check('email').custom( emailExists ),
    check('role').custom( isValidRole ),// check('role', 'Role no valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validateFields
], userPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( userExistsById ),
    check('role').custom( isValidRole ),
    validateFields
], userPut);

router.patch('/', userPatch);

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( userExistsById ),
    validateFields
], userDelete);


module.exports = router;