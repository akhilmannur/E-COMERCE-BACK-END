//******************* THIS  IS THE USER ROUTING  ROUTERS ********************************//

const express=require('express');
const userRouter=express.Router();
const userController =require('../controllers/userControllers');
const verifyTest = require('../middlewares/userAuthMiddleware');
const TryCatch=require('../middlewares/tryCatchMiddleware');



userRouter.post('/register',TryCatch(userController.createuser))
userRouter.post('/login',TryCatch(userController.userLogin))
userRouter.get('/products',verifyTest,TryCatch(userController.productList))
userRouter.get('/products/:id',verifyTest,TryCatch(userController.productById))
userRouter.get('/products/category/:categoryname',verifyTest,TryCatch(userController.productByCategory))
userRouter.post('/:id/cart',verifyTest,TryCatch(userController.addToCart))
userRouter.post('/:id/whislist',verifyTest,TryCatch(userController.addTowhishlist))
userRouter.get('/:id/cart',verifyTest,TryCatch(userController.viewCart))
userRouter.get('/:id/whishlist',verifyTest,TryCatch(userController.viewWishlist))
userRouter.delete('/:id/cart',verifyTest,TryCatch(userController.deleteCart))
userRouter.delete('/:id/whishlist',verifyTest,TryCatch(userController.deleteWishlist))



module.exports=userRouter