const cartModel=require('../models/Cart')

const productModel=require('../models/Product')


const addToCart=async(req,res)=>{

    try{

        const {userId,productId,quantity}=req.body


        const product=await productModel.findById(productId)

        if(!product){

            return res.status(404).json({

                success:false,
                message:"Product not found"

            })

        }


        let cart=await cartModel.findOne({user:userId})


        if(!cart){

            cart=await cartModel.create({

                user:userId,

                products:[

                    {
                        product:productId,
                        quantity:quantity || 1
                    }

                ]

            })

        }else{

            const productExist=cart.products.find(

                item=>item.product.toString()===productId

            )


            if(productExist){

                productExist.quantity+=quantity || 1

            }else{

                cart.products.push({

                    product:productId,
                    quantity:quantity || 1

                })

            }


            await cart.save()

        }


        res.status(200).json({

            success:true,
            message:"Product added to cart",
            cart

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const getCart=async(req,res)=>{

    try{

        const {userId}=req.params


        const cart=await cartModel
        .findOne({user:userId})
        .populate("products.product")


        if(!cart){

            return res.status(200).json({

                success:true,
                cart:{user:userId,products:[]}

            })

        }


        res.status(200).json({

            success:true,
            cart

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const updateCart=async(req,res)=>{

    try{

        const {userId,productId,quantity}=req.body


        const cart=await cartModel.findOne({user:userId})


        if(!cart){

            return res.status(404).json({

                success:false,
                message:"Cart not found"

            })

        }


        const product=cart.products.find(

            item=>item.product.toString()===productId

        )


        if(!product){

            return res.status(404).json({

                success:false,
                message:"Product not found in cart"

            })

        }


        product.quantity=quantity


        await cart.save()


        res.status(200).json({

            success:true,
            message:"Cart updated successfully",
            cart

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const removeFromCart=async(req,res)=>{

    try{

        const {userId,productId}=req.body


        const cart=await cartModel.findOne({user:userId})


        if(!cart){

            return res.status(404).json({

                success:false,
                message:"Cart not found"

            })

        }


        cart.products=cart.products.filter(

            item=>item.product.toString()!==productId

        )


        await cart.save()


        res.status(200).json({

            success:true,
            message:"Product removed from cart",
            cart

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const clearCart=async(req,res)=>{

    try{

        const {userId}=req.body


        const cart=await cartModel.findOne({user:userId})


        if(!cart){

            return res.status(404).json({

                success:false,
                message:"Cart not found"

            })

        }


        cart.products=[]


        await cart.save()


        res.status(200).json({

            success:true,
            message:"Cart cleared successfully"

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}


module.exports={

    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    clearCart

}