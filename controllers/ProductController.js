import {asyncHandler} from'../utilis/async.js';
import {createError} from'../utilis/createError.js';
import {Product} from'../models/Product.js';
import Joi from 'joi';


/**
 * This Function To Add Product To DataBase
 * @param {Object} req The object that represents the http call that called the api endpoint
 * @param {Object} res The object that represents the response to the http call
 */
 export const createProduct = asyncHandler(async (req,res)=>{
    console.log("hi");
    const schema = Joi.object({
        name: Joi.string().required(),
        productImage: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        countInStock: Joi.number().required(),
        description: Joi.string().required(),
        averageRating: Joi.number().required()
    });
    //if (schema['error'] !== undefined) throw new Error(validation.error);
    const product = await Product.create({...req.body});
    res.status(200).send({status: "Product Added Successfully", data: product});

});


export const getProducts = asyncHandler(async (req,res)=>{


    const keyWord = req.query.keyWord;
    const ltORgt = req.query;
    if(keyWord || ltORgt ){
        const searchItem = keyWord ?
            {name : {$regex: keyWord , $options: "i"}}:
            {};
        const priceRange = (!isNaN(Number(ltORgt.priceMin)) && !isNaN(Number(ltORgt.priceMax))) ?
            {price: {$gt: Number(ltORgt.priceMin), $lt: Number(ltORgt.priceMax)}}:
            {};
        let BrandQuery =  req.query.Brand.split(",")
        let CategoryQuery =  req.query.Category.split(",")

        const BrandSearch = req.query.Brand ? {brand : {$in : BrandQuery }}  : {}
        const CategorySearch = req.query.Category ? {category : {$in : CategoryQuery }}  : {}

           const searchProduct = await Product.find({$and :[ priceRange , BrandSearch,CategorySearch ]}).populate('Category').populate('brand');

        res.status(200).send({
            status: "success",
            data: { results : searchProduct.reverse() , count: searchProduct.length }
        })
    }else{
        const products = await Product.find().populate('brand').populate('Category');

        res.status(200).send({
            status: "success",
            data: { results : products.reverse() , count: products.length }
        })
    }

});
export const getProduct =asyncHandler(async (req,res)=>{
    const product= await Product.findById(req.params.productId).populate({
        path : "Review",
        select: "title text"
    }).populate('Category').populate('brand');
    if(!product)
        throw createError(404,`Product with id ${req.params.productId} not found`);

    res.status(200).send({status : "success",data : product});
})






export const updateProduct = asyncHandler(async (req,res,next)=>{
  const  productToUpdate =req.body;
    productToUpdate.color = JSON.parse(req.body.color);
    // productToUpdate.size = JSON.parse(req.body.size);
    // console.log(productToUpdate.color)

    const editProduct = await Product.findByIdAndUpdate(
        req.params.productId,
        productToUpdate,
        {
            new : true,
            runValidators : true
        }
    )

    if(!editProduct)
        throw createError(404 , `Product with id ${req.params.productId} not found `);

    const updatedProduct = await Product.findById(req.params.productId);

    res.status(201).send({status : "success" , data : updatedProduct});
})

export const deleteProduct = asyncHandler(async (req,res,next)=>{
    const deleteProduct = await Product.findByIdAndDelete(req.params.productId);

    if(!deleteProduct)
        throw createError(404,`Product with id ${req.params.productId} not found `);

    await deleteProduct.remove();
    res.status(204).send({status : "success" , message : "Product deleted successfully"});
})
