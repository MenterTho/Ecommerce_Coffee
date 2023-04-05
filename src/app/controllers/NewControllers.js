class NewControllers {
  // [GET] /news
  index(req, res) {
    res.locals.session = req.session;
    const title = "News";
    res.render("news", { title });
  }
  // [GET] /:slug
  show(req, res) {
    res.locals.session = req.session;
    res.send("PHIÊN BẢN NEWS MỚI CẬP NHẬT");
  }
}

module.exports = new NewControllers();
