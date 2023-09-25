const  mongoose = require('mongoose');
const User=require("../models/userSchema");
const product=require("../models/productSchema");
const jwt=require("jsonwebtoken");


mongoose.connect("mongodb://0.0.0.0:27017/E-Comerece-serverside",{
    useNewurlParser:true,
    useUnifiedTopology:true,
})


module.exports ={



// -----------------****** LOGIN ADMIN WITH USERNAME,PASSWORD[POST api/admin/login]-----------------****** //




loginAdmin:async(req,res)=>{

const {username,password} = req.body;

if(username===process.env.ADMIN_USERNAME  && password===process.env.ADMIN_PASSWORD){


    const token = jwt.sign(
        {username:username},
        process.env.ADMIN_ACCESS_TOKEN_SECRET
    );

    res.status(200).json({
        status: 'success',
        message: 'Successfully logged In.',
        data: {jwt_token: token}
        });

}
else{
    res.status(404).json({error:"Not a Admin"})
}
},






// -----------------****** SHOWING ALL USER LIST IN ADMIN PAGE[GET api/admin/users]-----------------****** //




showAllUser: async (req,res)=>{
    const alluser=await User.find();

    res.status(200).json({
        status: 'success',
        message: 'Successfully fetched user datas.',
        data: alluser
        })
},



// -----------------****** SHOWING A SPECIFIC  USER BASED  ON ID IN ADMIN PAGE[GET api/admin/users/:id]-----------------****** //



showUserBYId: async(req,res)=>{
     const userId=req.params.id;
     const user = await User.findById(userId);

     if(!user){
        return res.status(404).json({error:"User not found"})
     }

 

    res.status(200).json({
        status: 'success',
        message: 'Successfully fetched user data.',
        data: user
        })

},




// -----------------****** ADDING PRODUCT [POST api/admin/products]-----------------****** //





addProduct: async(req,res)=>{


    const {title,description,image,price,category}=req.body;

    

    const products=await product.create({
        title,description,image,price,category
    });


    if(!products){
        return res.status(404).json({error:"Product not created"})
    }

    res.status(201).json({
        status: 'success',
        message: 'Successfully Added a product.',
        })



},




// -----------------****** UPDATING A PRODUCT [PUT api/admin/products]-----------------****** //





updateProduct: async(req,res)=>{
    const {title,description,image,price,category,id}=req.body;
    const Product=await product.findById(id);

    if(!Product){
        return res.status(404).json({error:"product no found"});

    }
    await product.updateOne({_id:id},{$set:{tiile:title,description:description,price:price,image:image,category:category}});

    res.status(201).json({
        status: "success",
        message: "Successfully updated the product.",
      });

},






// -----------------****** DELETING A PRODUCT [DELETE api/admin/products]-----------------****** //




deleteProduct: async (req, res) => {
    const { id } = req.body;
    await product.findByIdAndDelete(id);
    res.status(201).json({
      status: "success",
      message: "Successfully deleted the product.",
    });
  },





  // -----------------****** SHOWING ALL  PRODUCTS LIST IN ADMIN PAGE [GET api/admin/products]-----------------****** //



  showAllProducts: async (req, res) => {
    const allproducts = await product.find();
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product detail.",
      data: allproducts,
    });
  },




// -----------------****** SHOWING A PRODUCTS LIST BASED ON  CATEGORY IN ADMIN PAGE [GET api/admin/products?category=name]-----------------****** //



ShowProductByCategory: async (req, res) => {
    const  categoryy=req.query.name;
    const products= await product.find({ category: categoryy})

  if(!products){

    return res.ststus(404).json({error:"categoery not found"})

  }

  res.status(200).json({
    status: "success",
    message: "Successfully fetched product details.",
    data: products,
  });

},





// -----------------****** SHOWING A PRODUCTS LIST BASED ON ID IN ADMIN PAGE [GET api/admin/products/:id]-----------------****** //





showProductById: async (req, res) => {
    const productId = req.params.id;
    const product = await product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product details.",
      data: product,
    });
  },






}