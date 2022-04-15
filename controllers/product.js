const { response } = require("express");
const { request } = require("express");

const { Product } = require('../models');

// PAGINADO - TOTAL - POPULATE
const getProducts = async (req, res) => {

    const { limit = 5, skip = 0 } = req.query;
    const query = { status: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate('user', 'name')
            .populate('category', 'name')
            .limit( limit )
            .skip( skip )
    ]);

    res.json({ total, products });
}

const getProduct = async (req = request, res =  response) => {
    const { id } =  req.params;
    const productById = await Product.findById( id )
            .populate('user', 'name')
            .populate('category', 'name')
    res.json( productById );
}

const createProduct = async (req = request, res =  response) => {
    
    const { status, user, ...body } = req.body;
    body.name = body.name.toUpperCase();
    
    const product = await Product.findOne({ name: body.name });
    if( product ) return res.status( 400 ).json({
        msg: `${ product.name } Product already exists`
    });
    
    const data = {
        name: body.name,
        user: req.authUser._id,
        ...body,
    }

    const newProduct =  new Product( data );
    await newProduct.save();
    res.status( 201 ).json( newProduct );
}

const updateProduct = async (req = request, res = response) => {

    const { id } =  req.params;
    const { status, user, category, ...data } = req.body;
    data.name = data.name.toUpperCase();

    const productExist = await Product.findOne({ name: data.name });
    if( productExist ) return res.status( 400 ).json({
        msg: `${ productExist.name } Product already exists`
    });
    
    if( data.name ){
        data.name = data.name.toUpperCase();
    }

    data.user = req.authUser._id;

    const product = await Product.findByIdAndUpdate( id, data, { new: true } );
    res.status( 200 ).json( product );
}

const deleteProduct = async(req = request, res = response) => {
    const { id } =  req.params;
    const product = await Product.findByIdAndUpdate( id, { status: false }, { new: true } );
    res.status( 200 ).json( product );
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}