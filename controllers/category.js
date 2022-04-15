const { response } = require("express");
const { request } = require("express");

const { Category } = require('../models');

// PAGINADO - TOTAL - POPULATE
const getCategories = async (req, res) => {

    const { limit = 5, skip = 0 } = req.query;
    const query = { status: true };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
            .populate('user', 'name')
            .limit( limit )
            .skip( skip )
    ]);

    res.json({ total, categories });
}

const getCategory = async (req = request, res =  response) => {
    const { id } =  req.params;
    const categoryById = await Category.findById( id )
        .populate('user', 'name');
    res.json( categoryById );
}

const createCategory = async (req = request, res =  response) => {

    const name = req.body.name.toUpperCase();
    const categoryDb = await Category.findOne({ name });
    if( categoryDb ) return res.status( 400 ).json({
        msg: `${ categoryDb.name } Category already exists`
    })

    const data = {
        name,
        user: req.authUser._id
    }

    const category =  new Category( data );
    await category.save();
    res.status( 201 ).json({msg: 'Category Create', category});
}

const updateCategory = async (req = request, res = response) => {
    const { id } =  req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.authUser._id;

    const category = await Category.findByIdAndUpdate( id, data, { new: true } );
    res.status( 200 ).json( category );
}

const deleteCategory = async(req = request, res = response) => {
    const { id } =  req.params;
    const category = await Category.findByIdAndUpdate( id, { status: false }, { new: true } );
    res.status( 200 ).json( category );
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}