const mongoose = require('mongoose');
const User=require("../models/userSchema");
const product=require("../models/productSchema");
const jwt=require("jsonwebtoken");


mongoose.connect("mongodb://0.0.0.0:27017/E-Comerece-serverside",{
    useNewurlParser:true,
    useUnifiedTopology:true,
})



module.exports ={



// -----------------****** CREATING USER WITH  NAME ,EMAIL,USERNAME[POST api/users/register]-----------------****** 




createuser:async (req,res)=>{
const {name,email,username,password}=req.body;

const user=await User.create({name:name,email:email,username:username,password:password});

if (!user) {
  res.json("error");
}

res.status(200).json({
    status:"success",
    message:"user registration successfully completed"
})

},




// -----------------******  USER  LOGIN WITH  USERNAME,PASSWORD[POST api/users/login]-----------------****** 



userLogin:async(req,res)=>{
    const {username,password}=req.body;

    const user=User.findOne({username: username,password:password});
  if(!user) {
    return res.status(404).json({error:"user not found"})
  }
  const token=jwt.sign(
    {username:user.username},
    process.env.USER_ACCESS_TOKEN_SECRET

  );

  res.status(200).json({status:"success",message:"Login sucessfull",data:token});

},



// -----------------******  GET ALL PRODUCTS DETAILS[GET api/users/products]-----------------****** 



productList: async (req,res)=>{
  const productList=await product.find();
  res.status(200).json({
    status: "success",
    message: "Product Listed successfully",
    data:productList,
  });
},





// -----------------******  GET A PRODUCT DETAILS BY ID [POST api/users/products/:id]-----------------****** 
  


productById: async (req,res)=>{
  const id=req.params.id;
  const productById = await product.findById(id);

  if(!productById){
    return res.status(404).json({error:"Product not found"})
  }

  res.status(200).json({
    status:"success",
    message:"product listed successfully",
    data:productById,
  });
},




// -----------------******  GET LIST OF PRODUCRT BY CATEGORYVICE [POST api/users/products/category/:categoryname]-----------------****** 




productByCategory:async (req,res)=>{
  const category=req.params.categoryname;
  const  products=await product.find({ category:category});

  if(!products){
    return res.status(404).json({error: 'category not found'});
  }

  res.status(200).json({
    status:"success",
    message:"successfully listed the category",
    data:products
  });
},






// -----------------******  ADDING PRODUCTS TO THE  CART BUY USER [POST api/users/:id/cart]-----------------****** 


addToCart: async (req, res) => {
  const userId = req.params.id;
  const productId=req.body.productId

  await User.updateOne({ _id: userId }, { $push: { cart: productId } });
  res.status(200).json({
    status: "success",
    message: "Successfully added product to cart.",
  });
},




// -----------------******  ADDING PRODUCTS TO THE  WISHLIST BUY USER [POST api/users/:id/whishlist]-----------------******


addTowhishlist: async (req, res) => {
  const userId = req.params.id;
  const productId=req.body.productId


  await User.updateOne({_id:userId},{$push:{wishlist:productId}})
  res.status(200).json({
    status:"succes",
    message:"product added to whishlist sucessfully"
  });
},





// -----------------******  SHOWING ALL  PRODUCTS IN THE CART TO THE USER [GET api/users/:id/cart]-----------------******






viewCart: async (req, res) => {
  const userId = req.params.id;
  const cart = await User.findOne({ _id: userId }).populate("cart");
  if (!cart) {
    return res.status(404).json({ error: "cart is empty" });
  }
  res.status(200).json({
    status: "success",
    message: "product sucessfully fetched",
    data: cart,
  });
},






// -----------------******  SHOWING ALL  PRODUCTS IN THE WISHLIST TO THE USER [GET api/users/:id/wishlist]-----------------******






viewWishlist: async (req, res) => {
  const userId = req.params.id;
  const wishlist = await User.find({ _id: userId }).populate("wishlist");
  if (!wishlist) {
    return res.status(404).json({ error: "whishlist is empty" });
  }
  res.status(200).json({
    status: "success",
    message: "product sucessfully fetched",
    data: wishlist,
  });
},





// -----------------******  REMOVING  PRODUCTS IN THE CART  BY  THE USER [DELETE api/users/:id/cart]-----------------******






deleteCart: async (req, res) => {
  const userId = req.params.id;
  const productId=req.body.productId
  await User.updateOne({ _id: userId }, { $pull: { cart: productId } });
  res.status(200).json({
    status: "success",
    message: "Successfully deleted product from Cart.",
  });
},



// -----------------******  REMOVING  PRODUCTS IN THE WISHLIST  BY  THE USER [DELETE api/users/:id/whishlist]-----------------******





deleteWishlist: async (req, res) => {
  const userId = req.params.id;
  const productId = req.body.productId;
  await User.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
  res.status(200).json({
    status: "success",
    message: "Successfully deleted product from wishlist.",
  });
},






}