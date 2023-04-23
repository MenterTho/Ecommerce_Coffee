const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const User = new Schema(
  {
    username: { type: String },
    password: { type: String },
    email: { type: String },
    image: { type: String, default: "upload/user.png" },
    access: { type: String },
    phone: { type: String, default: "none" },
    address: { type: String, default: "none" },
  },
  {
    timestamps: true,
  }
);

// Add plugin
User.plugin(mongoose_delete);
User.plugin(mongoose_delete, {
  // Hiện ngày xóa
  deletedAt: true,
  overrideMethods: "all",
});
module.exports = mongoose.model("User", User);
