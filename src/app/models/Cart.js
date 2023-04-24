const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cart = new Schema({
  name: { type: String, require: true },
  description: { type: String },
  image: { type: String },
  price: { type: String },
  type: { type: String },
  quality: { type: String },
  size: { type: String },
  size2: { type: String },
});

module.exports = mongoose.model("Cart", Cart);
