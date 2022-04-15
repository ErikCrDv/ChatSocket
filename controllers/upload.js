const path  = require("path");
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { fileUpload } = require("../helpers");
const { User, Product } = require("../models");
const res = require("express/lib/response");


const getFile = async ( req, res = response ) => {
    const { id, collection } = req.params;

    switch ( collection ) {
        case 'users':
            model =  await User.findById( id );
            if( !model ) return res.status( 400 ).json( { msg: 'User no exists' } );
            break;
        case 'products':
            model =  await Product.findById( id );
            if( !model ) return res.status( 400 ).json( { msg: 'Product no exists' } );
            break;
    
        default:
            return res.status( 500 ).json( { msg: 'Unimplemented Collection' } );
            break;
    }


    if( model.img ){
        const pathImg = path.join( __dirname, '../uploads/', collection, model.img );
        if( fs.existsSync( pathImg ) ){
            return res.sendFile( pathImg );
        }
    }

    const pathDefaultImg = path.join( __dirname, '../assets', '/no-image.jpg' );
    res.status ( 400 ).sendFile( pathDefaultImg );


}

const uploadFile  = async ( req, res = response) => {

    try {
        // const name = await fileUpload( req.files, ['txt', 'md'], 'files' );
        const name = await fileUpload( req.files, undefined, 'img' );

        res.status(200).json({ name });
        
    } catch (error) {
        res.status( 400 ).json({
            msg: error
        });
    }

}

const updateImg = async ( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model =  await User.findById( id );
            if( !model ) return res.status( 400 ).json( { msg: 'User no exists' } );
            break;
        case 'products':
            model =  await Product.findById( id );
            if( !model ) return res.status( 400 ).json( { msg: 'Product no exists' } );
            break;
    
        default:
            return res.status( 500 ).json( { msg: 'Unimplemented Collection' } );
            break;
    }

    //
    try { 
        if( model.img ){
            const pathImg = path.join( __dirname, '../uploads/', collection, model.img );
            if( fs.existsSync( pathImg ) ){
                fs.unlinkSync( pathImg );
            }
        }

    } catch (error) {
        res.status( 400 ).json({
            msg: error
        });
    }

    //
    try {
        const name = await fileUpload( req.files, undefined, collection );
        model.img = name;
        await model.save();

        res.status(200).json( model );
        
    } catch (error) {
        res.status( 400 ).json({
            msg: error
        });
    }

}


const updateImgCloudinary = async ( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model =  await User.findById( id );
            if( !model ) return res.status( 400 ).json( { msg: 'User no exists' } );
            break;
        case 'products':
            model =  await Product.findById( id );
            if( !model ) return res.status( 400 ).json( { msg: 'Product no exists' } );
            break;
    
        default:
            return res.status( 500 ).json( { msg: 'Unimplemented Collection' } );
            break;
    }


    if( model.img ){
        const nameArr = model.img.split('/');
        const name = nameArr[ nameArr.length - 1];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    model.img = secure_url;
    await model.save();

    res.status(200).json( model );
}


module.exports = {
    getFile,
    uploadFile,
    updateImg,
    updateImgCloudinary
}