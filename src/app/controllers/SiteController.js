const Coffee = require("../models/Coffee");
const User = require("../models/User");
const Cart = require("../models/Cart");
const { mutipleMogooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const jwt = require("jsonwebtoken");
const url = require("url");
const PAGE_SIZE = 4;

class SiteController {
  // [GET] /Home
  async home(req, res) {
    const title = "Home";
    const token = req.cookies.jwt_token;
    res.locals.session = req.session;
    let userInfo;
    // thông báo đăng nhập
    if (req.session.login) {
      req.session.login = false;
      res.locals.loginMess = "Đăng nhập thành công";
    } else if (req.session.logOut) {
      req.session.logOut = false;
      res.locals.logOutMess = "Đăng xuất thành công";
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
    // kiểm tra đăng nhập có phải phiên của user không
    // Nếu token hết hạn thì locals Inlogin cũng hết theo nên sẽ ăn đk session bên dưới để user login lại
    if (res.locals.Inlogin) {
      res.render("home", {
        title,
        jwt_token: token,
        userInfo,
      });
    } else if (req.session.token) {
      req.session.relogin = true;
      res.clearCookie("jwt_token");
      res.redirect("/login");
    } else {
      res.clearCookie("jwt_token");
      res.render("home", {
        title,
      });
    }
  }
  // [GET] /search
  search(req, res) {
    const title = "Search";
    const parsedUrl = url.parse(req.url, true);
    const searchTerm = parsedUrl.query.q;
    const gioitinh = parsedUrl.query.Gioitinh;

    res.render("search", {
      title,
      searchTerm,
      gioitinh,
    });
  }
  // [GET] /product
  product(req, res, next) {
    // res.locals.session = req.session;
    const title = "Products";
    const token = req.cookies.jwt_token;
    let userInfo;
    if (token) {
      try {
        // Giải mã token và lấy thông tin userInfo từ payload của token
        userInfo = jwt.verify(token, "secret_key");
        // Kiểm tra đăng nhập
        res.locals.Inlogin = true;
        // Tạo thông báo khi token hết hạn
        req.session.token = true;
      } catch (error) {
        console.error(error);
      }
    } else if (req.session.token) {
      // Phiên đăng nhập hết hạn
      req.session.relogin = true;
      res.clearCookie("jwt_token");
      res.redirect("/login");
    }
    Coffee.find({})
      .then((menu) => {
        res.render("products", {
          title,
          menu: mutipleMogooseToObject(menu),
          jwt_token: token,
          userInfo,
        });
      })
      .catch(next);
  }
  // [GET] /profileUser/:id
  profile(req, res, next) {
    const title = "Profile";
    const token = req.cookies.jwt_token;
    res.locals.session = req.session;
    // thông lỗi và cập nhật thành công
    if (req.session.email_err) {
      req.session.email_err = false;
      res.locals.email_errMess = "Email này đã tồn tại";
    }
    if (req.session.phone_err) {
      req.session.phone_err = false;
      res.locals.phone_errMess = "Số điện thoại này đã tồn tại";
    }
    if (req.session.updateEdit) {
      req.session.updateEdit = false;
      res.locals.updateEditMess = "Update thành công";
    }
    let userInfo;
    if (token) {
      try {
        // Giải mã token và lấy thông tin userInfo từ payload của token
        userInfo = jwt.verify(token, "secret_key");
        // Kiểm tra đăng nhập
        res.locals.Inlogin = true;
        // Tạo thông báo khi token hết hạn
        req.session.token = true;
      } catch (error) {
        console.error(error);
      }
    }
    if (res.locals.Inlogin) {
      // Đăng nhập thành công
      User.findOne({ _id: userInfo.id })
        .then((profile) => {
          res.render("profileUser", {
            title,
            profile: mongooseToObject(profile),
            jwt_token: token,
            userInfo: jwt.decode(token),
          });
        })
        .catch(next);
    } else if (req.session.token) {
      // Phiên đăng nhập hết hạn
      req.session.relogin = true;
      res.clearCookie("jwt_token");
      res.redirect("/login");
    } else {
      // Trả về login khi chưa đăng nhập
      req.session.noLogin = true;
      res.redirect("/login");
    }
  }
  // [PUT] /editUser
  editUser(req, res) {
    const { email, phone, address } = req.body;
    const token = req.cookies.jwt_token;
    let userInfo;
    if (token) {
      try {
        // Giải mã token và lấy thông tin userInfo từ payload của token
        userInfo = jwt.verify(token, "secret_key");
        // Kiểm tra đăng nhập
        res.locals.Inlogin = true;
        // Tạo thông báo khi token hết hạn
        req.session.token = true;
      } catch (error) {
        console.error(error);
      }
    }
    if (res.locals.Inlogin) {
      User.findOne({ email })
        .then((userWithEmail) => {
          User.findOne({ phone })
            .then((userWithPhone) => {
              if (
                userWithEmail &&
                userWithEmail._id.toString() !== userInfo.id
              ) {
                req.session.email_err = true;
                return res.redirect("/profile");
              } else if (
                userWithPhone &&
                userWithPhone._id.toString() !== userInfo.id
              ) {
                req.session.phone_err = true;
                return res.redirect("/profile");
              } else {
                User.findOneAndUpdate(
                  { _id: userInfo.id },
                  { email, phone, address }
                )
                  .then(() => {
                    req.session.updateEdit = true;
                    return res.redirect("/profile");
                  })
                  .catch((err) => {
                    return res.status(500).json("Internet server error");
                  });
              }
            })
            .catch((err) => {
              return res.status(500).json("Internet server error");
            });
        })
        .catch((err) => {
          return res.status(500).json("Internet server error");
        });
    } else if (req.session.token) {
      // Phiên đăng nhập hết hạn
      req.session.relogin = true;
      res.clearCookie("jwt_token");
      res.redirect("/login");
    }
  }
  // [PUT] /editImage
  editImage(req, res) {
    const { filename } = req.file;
    const path = require("path");
    const imagePath = path.join("upload", filename);
    const token = req.cookies.jwt_token;
    let userInfo;
    if (token) {
      try {
        // Giải mã token và lấy thông tin userInfo từ payload của token
        userInfo = jwt.verify(token, "secret_key");
        // Kiểm tra đăng nhập
        res.locals.Inlogin = true;
        // Tạo thông báo khi token hết hạn
        req.session.token = true;
      } catch (error) {
        console.error(error);
      }
    }
    if (res.locals.Inlogin) {
      User.findOneAndUpdate({ _id: userInfo.id }, { image: imagePath })
        .then(() => {
          req.session.updateEdit = true;
          return res.redirect("/profile");
        })
        .catch((err) => {
          return res.status(500).json("Internet server error");
        });
    } else if (req.session.token) {
      // Phiên đăng nhập hết hạn
      req.session.relogin = true;
      res.clearCookie("jwt_token");
      res.redirect("/login");
    }
  }
  // Sản phẩm
  //[GET] page
  page(req, res, next) {
    var page = req.query.page;
    const token = req.cookies.jwt_token;
    let userInfo;
    if (token) {
      try {
        // Giải mã token và lấy thông tin userInfo từ payload của token
        userInfo = jwt.verify(token, "secret_key");
        // Kiểm tra đăng nhập
        res.locals.Inlogin = true;
        // Tạo thông báo khi token hết hạn
        req.session.token = true;
      } catch (error) {
        console.error(error);
      }
    }
    if (page) {
      page = parseInt(page); //ép kiểu int
      var skip_number = (page - 1) * PAGE_SIZE;
      if (page < 1) {
        page = 1;
      }
      Coffee.find({})
        .skip(skip_number)
        .limit(PAGE_SIZE)
        .then((Coffees) => {
          res.render("products", {
            Coffees: mutipleMogooseToObject(Coffees),
            jwt_token: token,
            userInfo,
          });
        })
        .catch((err) => {
          res.status(500).json("error server");
        });
    } else if (req.session.token) {
      // Phiên đăng nhập hết hạn
      req.session.relogin = true;
      res.clearCookie("jwt_token");
      res.redirect("/login");
    } else {
      Coffee.find({}).then((Coffees) => {
        res.render("products", {
          Coffees: mutipleMogooseToObject(Coffees),
        }); // render trang home content là từ column trong sql courses
      });
    }
  }
  //[Get] create cart
  shoping(req, res, next) {
    const title = "Cart";
    const token = req.cookies.jwt_token;
    let userInfo;
    if (token) {
      try {
        // Giải mã token và lấy thông tin userInfo từ payload của token
        userInfo = jwt.verify(token, "secret_key");
        // Kiểm tra đăng nhập
        res.locals.Inlogin = true;
        // Tạo thông báo khi token hết hạn
        req.session.token = true;
      } catch (error) {
        console.error(error);
      }
    } else if (req.session.token) {
      // Phiên đăng nhập hết hạn
      req.session.relogin = true;
      res.clearCookie("jwt_token");
      res.redirect("/login");
    }
    Cart.find({})
      .then((carts) => {
        res.render("coffees/cart", {
          carts: mutipleMogooseToObject(carts),
          jwt_token: token,
          userInfo,
          title,
        }); // render trang shoping content là từ column trong sql carts
      })
      .catch(next);
    //lay du lieu tu database ra clients
  }
  //[delete] /shoping/:id
  async destroy(req, res, next) {
    try {
      const user = await Cart.findByIdAndDelete(req.params.id, req.body);
      if (!user) res.status(404).send("no item found");
      else {
        res.redirect("/shoping");
      }
    } catch (error) {
      res.status(505).send(error);
    }
  }
}
module.exports = new SiteController();
