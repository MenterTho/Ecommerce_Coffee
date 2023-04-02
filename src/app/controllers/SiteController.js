const Coffee = require('../models/Coffee');
const url = require('url');
const { mutipleMogooseToObject } = require('../../util/mongoose');
class SiteController {
    //  Đây là đường truyền cho trang web home, bên file kia muốn đổi tên nào cũng được
    // Nhưng đây thì không được vì nó là tên đường dẫn đến file home.hbs
    // [GET] /Home
    async home(req, res, next) {
        const title = 'Home';
        Coffee.find({})
            .then((menu) => {
                res.render('home', {
                    title,
                    menu: mutipleMogooseToObject(menu),
                });
            })
            .catch(next);
    }
    // [GET] /search
    search(req, res) {
        const title = 'Search';
        const parsedUrl = url.parse(req.url, true);
        const searchTerm = parsedUrl.query.q;
        const gioitinh = parsedUrl.query.Gioitinh;

        res.render('search', {
            title,
            searchTerm,
            gioitinh,
        });
    }
    // [GET] /product
    product(req, res, next) {
        const title = 'Products';
        res.render('products', { title });
    }
}

module.exports = new SiteController();
