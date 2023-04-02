class NewControllers {
    // [GET] /news
    index(req, res) {
        const title = 'News';
        res.render('news', { title });
    }
    // [GET] /:slug
    show(req, res) {
        res.send('PHIÊN BẢN NEWS MỚI CẬP NHẬT');
    }
}

module.exports = new NewControllers();
