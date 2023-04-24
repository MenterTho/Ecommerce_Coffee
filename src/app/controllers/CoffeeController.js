const Coffee = require("../models/Coffee");
const Cart = require("../models/Cart");
const { mongooseToObject } = require("../../util/mongoose");
class CoffeeController {
  // [GET] /:slug
  show(req, res, next) {
    const title = "Infomations";
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
    Coffee.findOne({ slug: req.params.slug })
      .then((coffee) => {
        res.render("coffees/show", {
          title,
          coffee: mongooseToObject(coffee),
          jwt_token: token,
          userInfo,
        });
      })
      .catch(next);
  }
  // [GET] /coffees/create
  create(req, res, next) {
    // res.locals.session = req.session;
    const title = "Create-Coffee";
    res.render("coffees/create", { title });
  }
  // [POST] /coffees/store
  store(req, res, next) {
    // res.locals.session = req.session;
    const fromData = req.body; // lấy dữ liệu sao khi tạo
    const coffee = new Cart(fromData);
    coffee
      .save()
      .then(() => res.redirect("/shoping")) // tạo xong trả về giỏ hàng
      .catch(next);
    console.log(fromData);
  }
}
module.exports = new CoffeeController();
