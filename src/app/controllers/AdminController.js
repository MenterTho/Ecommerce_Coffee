const User = require("../models/User");
const Coffee = require("../models/Coffee");
const { mongooseToObject } = require("../../util/mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

class AdminController {
  // [GET] /admin_index
  async admin_index(req, res) {
    const users = await User.find({}).lean();
    const coffees = await Coffee.find({}).lean();
    const usersDelete = await User.findDeleted({}).lean();
    const title = "Users & Coffees";
    const token = req.cookies.jwt_token;
    let userInfo;
    res.locals.session = req.session;
    // Thông báo
    if (req.session.lookUser) {
      req.session.lookUser = false;
      res.locals.lookUserMess = "Khóa user thành công";
    } else if (req.session.deleteUser) {
      req.session.deleteUser = false;
      res.locals.deleteUserMess = "Đã xóa user thành công";
    } else if (req.session.restoreUser) {
      req.session.restoreUser = false;
      res.locals.restoreUseMess = "Khôi phục user thành công";
    } else if (req.session.deleteProduct) {
      req.session.deleteProduct = false;
      res.locals.deleteProductMess = "Đã xóa product thành công";
    } else if (req.session.addProduct) {
      req.session.addProduct = false;
      res.locals.addProductMess = "Thêm product thành công";
    } else if (req.session.updateSuccess) {
      req.session.updateSuccess = false;
      res.locals.updateSuccessMess = "Update product thành công";
    } else if (req.session.nameExist) {
      req.session.nameExist = false;
      res.locals.nameExistMess = "Tên product đã tồn tại";
    }
    if (token) {
      try {
        // Giải mã token và lấy thông tin userInfo từ payload của token
        userInfo = jwt.verify(token, "secret_key");
        // gán người dùng đăng nhập và chưa
        res.locals.Inlogin = true;
        // Tạo thông báo khi token hết hạn
        req.session.token = true;
      } catch (error) {
        console.error(error);
      }
    }
    if (res.locals.Inlogin && userInfo.access) {
      res.render("admin_index", {
        title,
        layout: "adminPage",
        user: users,
        coffee: coffees,
        userDelete: usersDelete,
        jwt_token: token,
        userInfo,
      });
    } else if (req.session.token) {
      if (res.locals.Inlogin) {
        res.redirect("/admin/errorPage");
      } else {
        req.session.relogin = true;
        res.clearCookie("jwt_token");
        res.redirect("/login");
      }
    } else {
      res.redirect("/admin/errorPage");
    }
  }
  // [GET] admin/errorPage
  errorPage(req, res) {
    res.render("404page", {
      title: "404 Not Found",
      layout: "login",
    });
  }
  // [GET] admin/:id/editFromProducts
  editFromProducts(req, res) {
    const title = "Edit products";
    Coffee.findOne({ _id: req.params.id })
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.render("editProduct", {
          product: mongooseToObject(product),
          layout: "adminPage",
          title,
        });
      })
      .catch((err) => {
        return res.status(500).json({ message: "Server error" });
      });
  }
  // [PUT] admin/:id/editProducts
  editProducts(req, res) {
    const { filename } = req.file;
    const imagePath = path.join("upload", filename);
    const { name, description, image, price, size } = req.body;
    const token = req.cookies.jwt_token;
    let userInfo;

    if (token) {
      try {
        // Decode token and get userInfo from the payload
        userInfo = jwt.verify(token, "secret_key");
        res.locals.Inlogin = true;
        req.session.token = true;
      } catch (error) {
        console.error(error);
      }
    }

    if (res.locals.Inlogin) {
      // Check if the name is already in use
      Coffee.findOne({ name })
        .then((existingCoffee) => {
          // If the name is already in use, redirect back to the form
          if (
            existingCoffee &&
            existingCoffee._id.toString() !== req.params.id
          ) {
            req.session.nameExist = true;
            return res.redirect("/admin");
          } else {
            // If the name is not in use, update the Coffee
            Coffee.findByIdAndUpdate(
              req.params.id,
              { name, description, image: imagePath, price, size },
              { new: true }
            )
              .then(() => {
                req.session.updateSuccess = true;
                return res.redirect("/admin");
              })
              .catch((err) => {
                return res.status(500).json("Internal server error");
              });
          }
        })
        .catch((err) => {
          return res.status(500).json("Internal server error");
        });
    } else if (req.session.token) {
      // Session has expired
      req.session.relogin = true;
      res.clearCookie("jwt_token");
      res.redirect("/login");
    }
  }
  // [POST] admin/addProduct
  addProduct(req, res) {
    const { filename } = req.file;
    const imagePath = path.join("upload", filename);
    const { name, description, price, size } = req.body;

    // Kiểm tra xem ảnh có được upload hay không
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng tải lên ảnh sản phẩm" });
    }

    // Tạo đối tượng mới của Product
    const coffee = new Coffee({
      name: name,
      description: description,
      price: price,
      size: size,
      image: imagePath,
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    coffee
      .save()
      .then(() => {
        req.session.addProduct = true;
        res.redirect("/admin");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi lưu sản phẩm" });
      });
  }
  // [DELETE] admin/:id/lookUser
  lookUser(req, res, next) {
    req.session.lookUser = true;
    User.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  // [DELETE] admin/:id/deleteRealUser
  deleteRealUser(req, res, next) {
    req.session.deleteUser = true;
    User.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  // [DELETE] admin/:id/deleteProduct
  deleteProduct(req, res, next) {
    req.session.deleteProduct = true;
    Coffee.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  // [PATCH] admin/:id/restoreUser
  restoreUser(req, res, next) {
    req.session.restoreUser = true;
    User.restore({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
}

module.exports = new AdminController();
