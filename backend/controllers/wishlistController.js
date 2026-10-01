const wishlistModel=require('../models/Wishlist')

const productModel=require('../models/Product')


const addToWishlist=async(req,res)=>{

    try{

        const {userId,productId}=req.body


        const product=await productModel.findById(productId)

        if(!product){

            return res.status(404).json({

                success:false,
                message:"Product not found"

            })

        }


        let wishlist=await wishlistModel.findOne({user:userId})


        if(!wishlist){

            wishlist=await wishlistModel.create({

                user:userId,

                products:[productId]

            })

        }else{

            const productExist=wishlist.products.find(

                item=>item.toString()===productId

            )


            if(productExist){

                return res.status(400).json({

                    success:false,
                    message:"Product already in wishlist"

                })

            }


            wishlist.products.push(productId)

            await wishlist.save()

        }


        res.status(200).json({

            success:true,
            message:"Product added to wishlist",
            wishlist

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const getWishlist=async(req,res)=>{

    try{

        const {userId}=req.params


        const wishlist=await wishlistModel
        .findOne({user:userId})
        .populate("products")


        if(!wishlist){

            return res.status(200).json({

                success:true,
                wishlist:{user:userId,products:[]}

            })

        }


        res.status(200).json({

            success:true,
            wishlist

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const removeFromWishlist=async(req,res)=>{

    try{

        const {userId,productId}=req.body


        const wishlist=await wishlistModel.findOne({user:userId})


        if(!wishlist){

            return res.status(404).json({

                success:false,
                message:"Wishlist not found"

            })

        }


        wishlist.products=wishlist.products.filter(

            item=>item.toString()!==productId

        )


        await wishlist.save()


        res.status(200).json({

            success:true,
            message:"Product removed from wishlist",
            wishlist

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}


module.exports={

    addToWishlist,
    getWishlist,
    removeFromWishlist

}