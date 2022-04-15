const { request, response } = require("express");

const isAdminRole = ( req = request, res = response, next ) => {

    if( !req.authUser  ) return res.status( 500 ).json({
        msg: 'Role Error, Se requiere verificar el token primero'
    });

    const { role, name } = req.authUser;
    if( role !== 'ADMIN_ROLE' ) return res.status( 401 ).json({
        msg: `${ name } no es administrador - No puede realizar la accion deseada`
    });

    next();
}

const hasRole = ( ...roles ) => ( req = request, res = response, next ) => {
    
    if( !req.authUser  ) return res.status( 500 ).json({
        msg: 'Role Error, Se requiere verificar el token primero'
    });
    
    if( !roles.includes( req.authUser.role ) ) return res.status( 401 ).json({
        msg: 'Role no valido'
    });
    
    next();
}

module.exports = {
    isAdminRole,
    hasRole
};