const categoryModel=require('../models/Category')


const addCategory=async(req,res)=>{

    try{

        const {name,image}=req.body


        const categoryExist=await categoryModel.findOne({name})

        if(categoryExist){

            return res.status(400).json({

                success:false,
                message:"Category already exists"

            })

        }


        const category=await categoryModel.create({

            name,
            image

        })


        res.status(201).json({

            success:true,
            message:"Category added successfully",
            category

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const getCategories=async(req,res)=>{

    try{

        const categories=await categoryModel.find()

        res.status(200).json({

            success:true,
            categories

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const getCategoryById=async(req,res)=>{

    try{

        const category=await categoryModel.findById(req.params.id)

        if(!category){

            return res.status(404).json({

                success:false,
                message:"Category not found"

            })

        }


        res.status(200).json({

            success:true,
            category

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const updateCategory=async(req,res)=>{

    try{

        const {name,image}=req.body


        const category=await categoryModel.findByIdAndUpdate(

            req.params.id,

            {
                name,
                image
            },

            {
                new:true
            }

        )


        if(!category){

            return res.status(404).json({

                success:false,
                message:"Category not found"

            })

        }


        res.status(200).json({

            success:true,
            message:"Category updated successfully",
            category

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}



const deleteCategory=async(req,res)=>{

    try{

        const category=await categoryModel.findByIdAndDelete(req.params.id)


        if(!category){

            return res.status(404).json({

                success:false,
                message:"Category not found"

            })

        }


        res.status(200).json({

            success:true,
            message:"Category deleted successfully"

        })

    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        })

    }

}


module.exports={

    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory

}