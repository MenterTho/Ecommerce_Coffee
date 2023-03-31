const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Coffee = new Schema({
  name: { type: String, maxLength: 255 },
  description: { type: String, maxLength: 255 },
  image: { type: String, maxLength: 255 },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Coffee", Coffee);
