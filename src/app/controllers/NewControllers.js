class NewControllers {
  // [GET] /news
  index(req, res) {
    res.render("news");
  }
  // [GET] /:slug
  show(req, res) {
    res.send("PHIÊN BẢN NEWS MỚI CẬP NHẬT");
  }
}

module.exports = new NewControllers();
