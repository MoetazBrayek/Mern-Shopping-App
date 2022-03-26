import {asyncHandler} from'../utilis/async.js';
import {createError} from'../utilis/createError.js';
import {Product} from'../models/Product.js';
import Joi from 'joi';


/**
 * This Function To Add Product To DataBase
 * @param {Object} req The object that represents the http call that called the api endpoint
 * @param {Object} res The object that represents the response to the http call
 */
 export const CreateProduct = asyncHandler(async (req,res)=>{     
    const schema = Joi.object({
        name: Joi.string().required(),
        productImage: Joi.string().required(),
        price: Joi.number().required(),
        countInStock: Joi.number().required(),
        description: Joi.string().required(),
        averageRating: Joi.number().required()
    });
    const validation = schema.validate({ 
         name: req.body.name,
         productImage: req.body.productImage,
         price: req.body.price,
         countInStock: req.body.countInStock,
         description: req.body.description,
         averageRating: req.body.averageRating,
         });
    if (validation['error'] !== undefined) throw new Error(validation.error);
    const product = await Product.create({...req.body});
    res.status(200).send({status: "Product Added Successfully", data: product});

});


export const GetProducts = asyncHandler(async (req,res)=>{
    let product = await Product.find();
    if(!product)
    throw createError(404,`Product with id ${req.params.productId} not found`);
    res.status(200).send({status : "success",data : product});

});
export const GetProduct =asyncHandler(async (req,res)=>{
    const product= await Product.findById(req.params.productId);
    if(!product)
        throw createError(404,`Product with id ${req.params.productId} not found`);

    res.status(200).send({status : "success",data : product});
})

export const RemoveProduct =asyncHandler(async (req,res)=>{
    const product= await Product.findOneAndDelete(req.params.productId);
    if(!product)
        throw createError(404,`Product with id ${req.params.productId} not found`);

    res.status(200).send({status : "success",data : product});
})




export const UpdateProduct = asyncHandler(async (req,res,next)=>{
    let  productToUpdate =req.body;
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

