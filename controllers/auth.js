const { response } = require('express');

const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const renewToken = async ( req, res = response ) => {

    const { authUser } = req;

    // Generar Jwt
    const token = await generateJWT( authUser.id );

    res.json({
        authUser,
        token
    });
}

const login = async ( req, res = response ) => {
    
    const { email, password } = req.body;

    try {
        // Verificar Email
        const user = await User.findOne({ email });

        if( !user ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            })
        }

        // Usuario Activo
        if( !user.status ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - status'
            })
        }

        // Verificar password
        const validPassword = bcryptjs.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar Jwt
        const token = await generateJWT( user.id );

         res.json({
            user,
            token
        });

    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Error Interno, por favor comuniquese con el administrador'
        });
    }

}

const googleSignIn = async ( req, res ) => {
    const { id_token } = req.body;

    try {
        const { name, email, img } = await googleVerify( id_token );
        let user = await User.findOne({ email });

        if( !user ){
            const data = {
                name,
                email,
                password: ':p',
                img,
                google: true,
                role: 'USER_ROLE'
            };
            user = new User( data );
            await user.save();
        }

        if( !user.status ){
            res.status( 401 ).json({
                msg: 'Usuario Bloqueado'
            });
        }

        // Generar Jwt
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        res.status( 500 ).json({
            msg: 'Token no se pudo verificar'
        });
    }

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}