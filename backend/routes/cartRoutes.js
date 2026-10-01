const express=require('express')

const router=express.Router()


const {

    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    clearCart

}=require('../controllers/cartController')


router.post('/add',addToCart)

router.get('/get/:userId',getCart)

router.put('/update',updateCart)

router.delete('/remove',removeFromCart)

router.delete('/clear',clearCart)


module.exports=router