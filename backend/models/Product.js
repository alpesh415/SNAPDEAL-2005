const mongoose=require('mongoose')


const productSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    discountPrice:{
        type:Number,
        default:0
    },

    image:{
        type:String,
        default:""
    },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    stock:{
        type:Number,
        default:0
    },

    brand:{
        type:String,
        default:""
    },

    rating:{
        type:Number,
        default:4
    },

    reviews:{
        type:Number,
        default:0
    }

},{
    timestamps:true
})


const productModel=mongoose.model("Product",productSchema)


module.exports=productModel