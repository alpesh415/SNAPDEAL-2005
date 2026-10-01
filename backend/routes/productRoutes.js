const express=require('express')

const router=express.Router()


const {

    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct

}=require('../controllers/productController')


router.post('/add',addProduct)

router.get('/get',getProducts)

router.get('/get/:id',getProductById)

router.put('/update/:id',updateProduct)

router.delete('/delete/:id',deleteProduct)


module.exports=router