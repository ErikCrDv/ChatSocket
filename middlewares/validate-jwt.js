const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async ( req, res, next ) => {

    const token = req.header('x-token');
    if( !token ) return res.status( 401 ).json({
        msg: 'No hay token en la peticion'
    });

    try {
        const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );
        const authUser = await User.findById( uid );

        if( !authUser ) return res.status( 401 ).json({
            msg: 'Token no valido - Usuario no existe'
        });
        if( !authUser.status ) return res.status( 401 ).json({
            msg: 'Token no valido - Status False'
        });

        req.authUser = authUser;
        next();
    } catch (error) {
        console.log( error );
        res.status(401).json({
            msg: 'Token No valido'
        });
    }
}

module.exports = {
    validateJWT
};