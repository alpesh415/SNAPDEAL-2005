const mongoose=require('mongoose')


const categorySchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true
    },

    image:{
        type:String,
        default:""
    }

})


const categoryModel=mongoose.model("Category",categorySchema)


module.exports=categoryModel