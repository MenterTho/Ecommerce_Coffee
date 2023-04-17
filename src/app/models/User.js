const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = new Schema(
  {
    username: { type: String },
    password: { type: String },
    email: { type: String },
    image: { type: String, default: "img/user.png" },
    access: { type: String },
    phone: { type: String, default: "none" },
    address: { type: String, default: "none" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
