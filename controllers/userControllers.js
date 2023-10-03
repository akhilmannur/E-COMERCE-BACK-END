const mongoose = require("mongoose");
const User = require("../models/userSchema");
const product = require("../models/productSchema");
const jwt = require("jsonwebtoken");
const { joiUservalidationSchema } = require("../models/userValidationSchema");
const bcrypt = require("bcrypt");
const stripe = require("stripe")(process.env.PAYMENT_SECRETE_KEY);
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
  useNewurlParser: true,
  useUnifiedTopology: true,
});
let temp

module.exports = {
  // -----------------****** CREATING USER WITH  NAME ,EMAIL,USERNAME[POST api/users/register]-----------------******//

  createUser: async (req, res) => {
    const { value, error } = joiUservalidationSchema.validate(req.body);
    if (error) {
      res.json(error.message);
    }
    const { name, email, username, password } = value;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "Invalid",
        message: "User already exists with this email.",
      });
    }

    const user = await User.create({
      name: name,
      email: email,
      username: username,
      password: password,
    });

    if (!user) {
      res.json("error");
    }

    res.status(200).json({
      status: "success",
      message: "user registration successfully completed",
    });
  },

  // -----------------******  USER  LOGIN WITH  USERNAME,PASSWORD[POST api/users/login]-----------------******//

  userLogin: async (req, res) => {
    const { value, error } = joiUservalidationSchema.validate(req.body);
    if (error) {
      res.json(error.message);
    }

    const { username, password } = value;

    const user = await User.findOne({ username: username});
    // console.log(user);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    if (!password || !user.password ) {
      console.log(password , user.password);
      return res
        .status(404)
        .json({ status: "error", message: "Inavalid input" });
    }

    const passwordverify = await bcrypt.compare(password, user.password);

    if (!passwordverify) {
      return res
        .status(404)
        .json({ status: "error", message: "Incorrect password" });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.USER_ACCESS_TOKEN_SECRET,
      { expiresIn: 86400 }
    );

    res
      .status(200)
      .json({ status: "success", message: "Login sucessfull", data: token });
  },

  // -----------------******  GET ALL PRODUCTS DETAILS[GET api/users/products]-----------------******//

  productList: async (req, res) => {
    const productList = await product.find();
    res.status(200).json({
      status: "success",
      message: "Product Listed successfully",
      data: productList,
    });
  },

  // -----------------******  GET A PRODUCT DETAILS BY ID [POST api/users/products/:id]-----------------******//

  productById: async (req, res) => {
    const id = req.params.id;
    const productById = await product.findById(id);

    if (!productById) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "product listed successfully",
      data: productById,
    });
  },

  // -----------------******  GET LIST OF PRODUCRT BY CATEGORYVICE [POST api/users/products/category/:categoryname]-----------------******//

  productByCategory: async (req, res) => {
    const category = req.params.categoryname;
    const products = await product.find({ category: category });

    if (!products) {
      return res.status(404).json({
        status: "error",
        message: "category not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "successfully listed the category",
      data: products,
    });
  },

  // -----------------******  ADDING PRODUCTS TO THE  CART BUY USER [POST api/users/:id/cart]-----------------******//

  addToCart: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;

    await User.updateOne({ _id: userId }, { $push: { cart: productId } }); //$addToSet
    res.status(200).json({
      status: "success",
      message: "Successfully added product to cart.",
    });
  },

  // -----------------******  ADDING PRODUCTS TO THE  WISHLIST BUY USER [POST api/users/:id/whishlist]-----------------******//

  addTowhishlist: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;

    await User.updateOne({ _id: userId }, { $push: { wishlist: productId } });
    res.status(200).json({
      status: "succes",
      message: "product added to whishlist sucessfully",
    });
  },

  // -----------------******  SHOWING ALL  PRODUCTS IN THE CART TO THE USER [GET api/users/:id/cart]-----------------******//

  viewCart: async (req, res) => {
    const userId = req.params.id;
    const cart = await User.findOne({ _id: userId }).populate("cart");
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "cart is empty",
      });
    }
    res.status(200).json({
      status: "success",
      message: "product sucessfully fetched",
      data: cart,
    });
  },

  // -----------------******  SHOWING ALL  PRODUCTS IN THE WISHLIST TO THE USER [GET api/users/:id/wishlist]-----------------******//

  viewWishlist: async (req, res) => {
    const userId = req.params.id;
    const wishlist = await User.find({ _id: userId }).populate("wishlist");
    if (!wishlist) {
      return res.status(404).json({
        status: "error",
        message: "whishlist is empty",
      });
    }
    res.status(200).json({
      status: "success",
      message: "product sucessfully fetched",
      data: wishlist,
    });
  },

  // -----------------******  REMOVING  PRODUCTS IN THE CART  BY  THE USER [DELETE api/users/:id/cart]-----------------******//

  deleteCart: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;
    await User.updateOne({ _id: userId }, { $addToSet: { cart: productId } });
    res.status(200).json({
      status: "success",
      message: "Successfully deleted product from Cart.",
    });
  },

  // -----------------******  REMOVING  PRODUCTS IN THE WISHLIST  BY  THE USER [DELETE api/users/:id/whishlist]-----------------******//

  deleteWishlist: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;
    await User.updateOne(
      { _id: userId },
      { $addToSet: { wishlist: productId } }
    );
    res.status(200).json({
      status: "success",
      message: "Successfully deleted product from wishlist.",
    });
  },

  // -----------------****** PAYMENT BY  USER [POST api/users/:id/payment]-----------------******//

  payment: async (req, res) => {
    const user = await User.find({ _id: req.params.id }).populate("cart");
    const cartitem = user[0].cart.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    });
    console.log(cartitem);
    if (cartitem.length > 0) {
      const session = await stripe.checkout.sessions.create({
        line_items: cartitem,
        mode: "payment",
        success_url: `http://127.0.0.1:5000/api/users/payment/sucess`,
        cancel_url: `http://127.0.0.1:5000/api/users/payment/cancel`,
      });
      temp = {
        cartitem: user[0].cart.map((item) => item._id),
        id: req.params.id,
        paymentid: session.id,
        amount: session.amount_total / 100,
      };

      res.send({ url: session.url });
    } else {
      res.send("there is no cart item");
    }
  },

  // -----------------****** PAYMENT BY  USER SUCCESS [GET api/users/payment/success]-----------------******//

  paymentSucess: async (req, res) => {
    console.log(temp);
    const user = await User.find({ _id: temp.id });
    if (user.length != 0) {
      await User.updateOne(
        { _id: temp.id },
        {
          $push: {
            orders: {
              product: temp.cartitem,
              date: new Date(),
              orderid: Math.random(),
              paymentid: temp.paymentid,
              totalamount: temp.amount,
            },
          },
        }
      );
      await User.updateOne({ _id: temp.id }, { cart: [] });
    }
    res.status(200).json({
      status: "success",
      message: "successfully added in order",

    });
  },

  // -----------------****** PAYMENT BY  USER CANCEL [POST api/users/payment/cancel]-----------------******//

  paymentCancel: async (req, res) => {
    res.json("payment cancelled");
  },
};
