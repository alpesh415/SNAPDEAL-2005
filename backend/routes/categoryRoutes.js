const express=require('express')

const router=express.Router()


const {

    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory

}=require('../controllers/categoryController')


router.post('/add',addCategory)

router.get('/get',getCategories)

router.get('/get/:id',getCategoryById)

router.put('/update/:id',updateCategory)

router.delete('/delete/:id',deleteCategory)


module.exports=router