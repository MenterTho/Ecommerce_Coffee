// Tất cả router điều được nạp vào file index
const newsRouter = require("./news");
const siteRouter = require("./site");

function route(app) {
  // Các URL trên web
  app.use("/news", newsRouter);
  app.use("/", siteRouter);
}

module.exports = route;
