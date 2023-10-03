const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,

  cart: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
  wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
  orders: [],
});

userSchema.pre("save", async function (next) {
 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  next();
 
});

module.exports = mongoose.model("user", userSchema);
