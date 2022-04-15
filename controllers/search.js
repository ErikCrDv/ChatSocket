const { ObjectId } = require('mongoose').Types;

const { response } = require("express");
const { request } = require("express");

const { User, Role, Category, Product } = require('../models');
const allowedColection = [
    'users',
    'roles',
    'categories',
    'products'
];

const searchUsers = async ( keywords = '', res =  response ) => {
    const isMongoId = ObjectId.isValid( keywords );

    if( isMongoId ){
        const user = await User.findById( keywords );
        return res.json({
            results: user ? [ user ] : []
        });
    }

    const regex = new RegExp( keywords, 'i' );
    const user = await User.find({
        $or: [ { name: regex }, { email: regex } ],
        $and: [ { status: true } ]
    });
    return res.json({
        results: user
    });
}

const searchCategories = async ( keywords = '', res =  response ) => {
    const isMongoId = ObjectId.isValid( keywords );

    if( isMongoId ){
        const category = await Category.findById( keywords );
        return res.json({
            results: category ? [ category ] : []
        });
    }

    const regex = new RegExp( keywords, 'i' );
    const category = await Category.find( { name: regex, status: true } );
    return res.json({
        results: category
    });
}

const searchProducts = async ( keywords = '', res =  response ) => {
    const isMongoId = ObjectId.isValid( keywords );

    if( isMongoId ){
        const product = await Product.findById( keywords );
        return res.json({
            results: product ? [ product ] : []
        });
    }

    const regex = new RegExp( keywords, 'i' );
    const product = await Product.find( { name: regex, status: true } );
    return res.json({
        results: product
    });
}


const search = ( req = request, res = response ) => {

    const { colection, keywords } = req.params;

    if( !allowedColection.includes( colection ) ){
        return res.status( 400 ).json({
            msg: `Only Allowed Collection: ${ allowedColection }`
        });
    }

    switch ( colection ) {
        case 'users':
            searchUsers( keywords, res );
            break;

        case 'categories':
            searchCategories( keywords, res );
            break;

        case 'products':
            searchProducts( keywords, res );
            break;
    
        default:
            return res.status( 500 ).json({
                msg: `Active this Collection`
            });
            break;
    }
}

module.exports = {
    search
}