const orderModel=require('../models/Order')

const cartModel=require('../models/Cart')

const productModel=require('../models/Product')


const createOrder=async(req,res)=>{

    try{

        const {userId,address}=req.body


        const cart=await cartModel
        .findOne({user:userId})
        .populate("products.product")


        if(!cart || cart.products.length===0){

            return res.status(400).json({

                success:false,
                message:"Cart is empty"

            })

        }


        let totalAmount=0

        const products=[]


        for(const item of cart.products){

            const product=item.product

            if(!product){
                continue
            }


            if(product.stock<item.quantity){

                return res.status(400).json({

                    success:false,
                    message:`Insufficient stock for ${product.name}`

                })

            }


            products.push({

                product:product._id,

                quantity:item.quantity,

                price:product.discountPrice>0
                    ?product.discountPrice
                    :product.price

            })


            const itemPrice=product.discountPrice>0
                ?product.discountPrice
                :product.price


            totalAmount+=itemPrice*item.quantity

        }


        if(products.length===0){

            return res.status(400).json({

                success:false,
                message:"Cart is empty"

            })

        }


        const order=await orderModel.create({

            user:userId,

            products,

            totalAmount,

            address

        })

        res.status(201).json({

            success:true,

            message:"Order created successfully",

            order

        })

    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        })

    }

}



const getMyOrders=async(req,res)=>{

    try{

        const {userId}=req.params


        const orders=await orderModel
        .find({user:userId})
        .populate("products.product")
        .sort({createdAt:-1})


        res.status(200).json({

            success:true,

            orders

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const getOrderById=async(req,res)=>{

    try{

        const order=await orderModel
        .findById(req.params.id)
        .populate("user")
        .populate("products.product")


        if(!order){

            return res.status(404).json({

                success:false,
                message:"Order not found"

            })

        }


        res.status(200).json({

            success:true,

            order

        })

    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        })

    }

}



const cancelOrder=async(req,res)=>{

    try{

        const {id}=req.params


        const order=await orderModel.findById(id)


        if(!order){

            return res.status(404).json({

                success:false,
                message:"Order not found"

            })

        }


        if(
            order.status==="shipped" ||
            order.status==="delivered"
        ){

            return res.status(400).json({

                success:false,
                message:"Order cannot be cancelled"

            })

        }


        order.status="cancelled"


        await order.save()


        res.status(200).json({

            success:true,

            message:"Order cancelled successfully",

            order

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const updateOrderStatus=async(req,res)=>{

    try{

        const {status}=req.body


        const order=await orderModel.findByIdAndUpdate(

            req.params.id,

            {
                status
            },

            {
                new:true
            }

        )


        if(!order){

            return res.status(404).json({

                success:false,
                message:"Order not found"

            })

        }


        res.status(200).json({

            success:true,

            message:"Order status updated successfully",

            order

        })

    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        })

    }

}


module.exports={

    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus

}