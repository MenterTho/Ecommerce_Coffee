// Tất cả router điều được nạp vào file index
// Đây là file tổng hợp từ app/controllers và router
const loginRouter = require("./logins");
const newsRouter = require("./news");
const siteRouter = require("./site");
const coffeesRouter = require("./coffees");
const adminController = require("./admins");

function route(app) {
  // Các URL trên web
  // [USE] login
  app.use("/admin", adminController);
  // [USE] login
  app.use("/login", loginRouter);
  // [USE] news
  app.use("/news", newsRouter);
  // [USE] info coffee
  app.use("/coffees", coffeesRouter);
  // [USE] home
  app.use("/", siteRouter);
}

module.exports = route;
