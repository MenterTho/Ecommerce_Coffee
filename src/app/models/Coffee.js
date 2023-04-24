const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Coffee = new Schema(
  {
    name: { type: String },
    description: { type: String },
    image: { type: String },
    slug: { type: String, slug: "name" },
    price: { type: String },
    size: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coffee", Coffee);
