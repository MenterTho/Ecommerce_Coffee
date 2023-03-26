class SiteController {
  //  Đây là đường truyền cho trang web home, bên file kia muốn đổi tên nào cũng được
  // Nhưng đây thì không được vì nó là tên đường dẫn đến file home.hbs
  // [GET] /Home
  home(req, res) {
    res.render("home");
  }
  // [GET] /search
  search(req, res) {
    res.render("search");
  }
}

module.exports = new SiteController();
