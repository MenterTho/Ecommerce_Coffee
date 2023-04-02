// Tất cả router điều được nạp vào file index
// Đây là file tổng hợp từ app/controllers và router
const newsRouter = require('./news');
const siteRouter = require('./site');
const coffeesRouter = require('./coffees');

function route(app) {
    // Các URL trên web
    // [USE] news
    app.use('/news', newsRouter);
    // [USE] info coffee
    app.use('/coffees', coffeesRouter);
    // [USE] home
    app.use('/', siteRouter);
}

module.exports = route;
