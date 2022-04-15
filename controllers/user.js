const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const userGet = async ( req = request, res = response) => {
    const { limit = 5, skip = 0 } = req.query;
    const query = { status: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .limit( limit )
            .skip( skip )
    ]);

    res.json({ total, users });
};

const userPost = async ( req = request, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User( { name, email, password, role } );

    //Encriptar Password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en Db
    await user.save();

    res.json(user);
};

const userPut = async ( req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...rest } = req.body;

    // Validar id BD

    // Password
    if( password ){
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, rest );

    res.json({
        user
    });
};

const userPatch = ( req = request, res = response) => {
    res.json({
        msg: 'Patch Api - Controller'
    });
};

const userDelete = async ( req = request, res = response) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate( id, { status: false } );
    res.json({ user });
};


module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}