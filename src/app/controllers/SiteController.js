const Coffee = require("../models/Coffee");
const User = require("../models/User");
const { mutipleMogooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

const url = require("url");
class SiteController {
  //  Đây là đường truyền cho trang web home, bên file kia muốn đổi tên nào cũng được
  // Nhưng đây thì không được vì nó là tên đường dẫn đến file home.hbs
  // [GET] /Home
  async home(req, res, next) {
    const title = "Home";
    // Biến lấy dữ liệu session tất cả
    res.locals.session = req.session;
    // Kiểm tra thông báo đăng nhập
    if (req.session.login) {
      // Gán biến login
      req.session.login = false;
      // Gán biến thông báo
      res.locals.loginMessage = "Đăng nhập thành công!";
    }
    // kiểm tra thông báo đăng xuất
    if (req.session.logout) {
      // Gán biến logout = false để không hiển thị thông báo lần nữa
      req.session.logout = false;
      // Gán biến thông báo để hiển thị trên view
      res.locals.logoutMessage = "Đăng xuất thành công!";
    }
    Coffee.find({})
      .then((menu) => {
        res.render("home", {
          title,
          menu: mutipleMogooseToObject(menu),
        });
      })
      .catch(next);
  }
  // [GET] /search
  search(req, res) {
    res.locals.session = req.session;
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
    res.locals.session = req.session;
    const title = "Products";
    Coffee.find({})
      .then((menu) => {
        res.render("products", {
          title,
          menu: mutipleMogooseToObject(menu),
        });
      })
      .catch(next);
  }
  // [GET] /profileUser/:id
  profile(req, res, next) {
    const title = "Profile";
    res.locals.session = req.session;
    if (req.session && req.session.user) {
      User.findOne({ _id: req.session.user._id })
        .then((profile) => {
          res.render("profileUser", {
            title,
            profile: mongooseToObject(profile),
          });
        })
        .catch(next);
    } else {
      req.session.nologin = true;
      res.redirect("/login");
    }
  }
}

module.exports = new SiteController();
