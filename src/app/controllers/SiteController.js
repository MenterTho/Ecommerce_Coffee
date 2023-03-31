const Coffee = require("../models/Coffee");
const { mutipleMogooseToObject } = require("../../util/mongoose");
class SiteController {
  //  Đây là đường truyền cho trang web home, bên file kia muốn đổi tên nào cũng được
  // Nhưng đây thì không được vì nó là tên đường dẫn đến file home.hbs
  // [GET] /Home
  async home(req, res, next) {
    Coffee.find({})
      .then((menu) => {
        res.render("home", {
          menu: mutipleMogooseToObject(menu),
        });
      })
      .catch(next);
  }
  // [GET] /search
  search(req, res) {
    res.render("search");
  }
}

module.exports = new SiteController();
