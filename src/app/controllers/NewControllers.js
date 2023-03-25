class NewControllers {
  // [GET] /news
  index(req, res) {
    res.render("news");
  }
  // [GET] /news/:slug
  show(req, res) {
    res.send("PHIÊN BẢN NEW MỚI CẬP NHẬT");
  }
}

module.exports = new NewControllers();
