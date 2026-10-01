const mongoose=require('mongoose')


const orderSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    products:[

        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },

            quantity:{
                type:Number,
                required:true
            },

            price:{
                type:Number,
                required:true
            }
        }

    ],

    totalAmount:{
        type:Number,
        required:true
    },

    address:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:[
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default:"pending"
    },

    razorpayOrderId:{
        type:String,
        default:""
    },

    paymentStatus:{
        type:String,
        enum:[
            "pending",
            "paid",
            "failed"
        ],
        default:"pending"
    }

},{
    timestamps:true
})


const orderModel=mongoose.model("Order",orderSchema)


module.exports=orderModel