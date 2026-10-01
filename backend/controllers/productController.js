const productModel=require('../models/Product')

const categoryModel=require('../models/Category')


const addProduct=async(req,res)=>{

    try{

        const {
            name,
            description,
            price,
            discountPrice,
            image,
            category,
            stock,
            brand
        }=req.body


        const categoryExist=await categoryModel.findById(category)

        if(!categoryExist){

            return res.status(404).json({

                success:false,
                message:"Category not found"

            })

        }


        const product=await productModel.create({

            name,
            description,
            price,
            discountPrice,
            image,
            category,
            stock,
            brand

        })


        res.status(201).json({

            success:true,
            message:"Product added successfully",
            product

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const getProducts=async(req,res)=>{

    try{

        const products=await productModel
        .find()
        .populate("category")


        res.status(200).json({

            success:true,
            products

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const getProductById=async(req,res)=>{

    try{

        const product=await productModel
        .findById(req.params.id)
        .populate("category")


        if(!product){

            return res.status(404).json({

                success:false,
                message:"Product not found"

            })

        }


        res.status(200).json({

            success:true,
            product

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const updateProduct=async(req,res)=>{

    try{

        const product=await productModel.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new:true
            }

        )


        if(!product){

            return res.status(404).json({

                success:false,
                message:"Product not found"

            })

        }


        res.status(200).json({

            success:true,
            message:"Product updated successfully",
            product

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const deleteProduct=async(req,res)=>{

    try{

        const product=await productModel.findByIdAndDelete(req.params.id)


        if(!product){

            return res.status(404).json({

                success:false,
                message:"Product not found"

            })

        }


        res.status(200).json({

            success:true,
            message:"Product deleted successfully"

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}


module.exports={

    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct

}