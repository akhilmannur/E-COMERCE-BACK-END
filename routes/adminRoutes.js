//******************* THIS  IS THE ADMIN ROUTING  ROUTERS ********************************//

const express=require('express');
const adminRouter=express.Router();
const adminControllers=require('../controllers/adminController');
const verifyTest=require('../middlewares/adminAuthMiddleware');
const TryCatch=require('../middlewares/tryCatchMiddleware');



adminRouter.post('/login',TryCatch(adminControllers.loginAdmin))
adminRouter.get('/users',verifyTest,TryCatch(adminControllers.showAllUser))
adminRouter.get('/users/:id',verifyTest, TryCatch(adminControllers.showUserBYId))
adminRouter.post('/products',verifyTest ,TryCatch(adminControllers.addProduct))
adminRouter.put('/products',verifyTest,TryCatch(adminControllers.updateProduct))
adminRouter.delete('/products',verifyTest,TryCatch(adminControllers.deleteProduct))
adminRouter.get('/products',verifyTest,TryCatch(adminControllers.showAllProducts))
adminRouter.get('/products/category',verifyTest,TryCatch(adminControllers.ShowProductByCategory))
adminRouter.get('/products/:id',verifyTest,TryCatch(adminControllers.showProductById))




module.exports=adminRouter
