const Coffee = require('../models/Coffee');
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
        res.render('search', {
            title,
        });
    }
    // [GET] /product
    product(req, res, next) {
        const title = 'Products';
        res.render('products', { title });
    }
}

module.exports = new SiteController();
