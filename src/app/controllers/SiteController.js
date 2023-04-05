const Coffee = require("../models/Coffee");
const { mutipleMogooseToObject } = require("../../util/mongoose");
const url = require("url");
class SiteController {
  //  Đây là đường truyền cho trang web home, bên file kia muốn đổi tên nào cũng được
  // Nhưng đây thì không được vì nó là tên đường dẫn đến file home.hbs
  // [GET] /Home
  async home(req, res, next) {
    const title = "Home";
    // Biến lấy dữ liệu user
    res.locals.session = req.session;

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
}

module.exports = new SiteController();
