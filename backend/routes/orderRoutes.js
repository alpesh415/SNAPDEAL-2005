const express=require('express')

const router=express.Router()


const {

    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus

}=require('../controllers/orderController')


router.post('/create',createOrder)

router.get('/my-orders/:userId',getMyOrders)

router.get('/get/:id',getOrderById)

router.put('/cancel/:id',cancelOrder)

router.put('/status/:id',updateOrderStatus)


module.exports=router