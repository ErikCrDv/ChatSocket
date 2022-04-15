const { User, Role, Category, Product } = require('../models');

const isValidRole = async ( role = '' ) => {
    const roleExists = await Role.findOne( { role } )
    if( !roleExists ) throw new Error(`El role ${ role } no esta registrado en la base de BD`);
}

const emailExists = async ( email = '' ) => {
    const emailExistsDb = await User.findOne( { email } );
    if( emailExistsDb ) throw new Error(`El correo ya ha sido registrado`);
}

const userExistsById = async ( id ) => {
    const userExistsDb = await User.findById( id );
    if( !userExistsDb ) throw new Error(`No existe un usuario con el ID ${ id }`);
}

const categoryExistsById = async ( id ) => {
    const categoryExistsDb = await Category.findById( id );
    if( !categoryExistsDb ) throw new Error(`No existe la caegoria con el ID ${ id }`);
}

const productExistsById = async ( id ) => {
    const productExistsDb = await Product.findById( id );
    if( !productExistsDb ) throw new Error(`No existe el producto con el ID ${ id }`);
}

const  allowedCollections = ( collection = '', collections = [] ) => {
    const includes = collections.includes( collection );
    if( !includes ){
        throw new Error(`${ collection } is not Allowed`);
    }

    return true;
}

module.exports = {
    isValidRole,
    emailExists,
    userExistsById,
    categoryExistsById,
    productExistsById,
    allowedCollections
}