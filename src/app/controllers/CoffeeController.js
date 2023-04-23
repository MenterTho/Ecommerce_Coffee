const Coffee = require("../models/Coffee");
const Cart = require("../models/Cart");
const { mongooseToObject } = require("../../util/mongoose");
class CoffeeController {
  // [GET] /:slug
  show(req, res, next) {
    const title = "Infomations";
    // res.locals.session = req.session;
    Coffee.findOne({ slug: req.params.slug })
      .then((coffee) => {
        res.render("coffees/show", {
          title,
          coffee: mongooseToObject(coffee),
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
