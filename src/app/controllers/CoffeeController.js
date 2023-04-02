const Coffee = require('../models/Coffee');
const { mongooseToObject } = require('../../util/mongoose');
class CoffeeController {
    // [GET] /:slug
    show(req, res, next) {
        const title = 'Infomations';
        Coffee.findOne({ slug: req.params.slug })
            .then((coffee) => {
                res.render('coffees/show', {
                    title,
                    coffee: mongooseToObject(coffee),
                });
            })
            .catch(next);
    }
}

module.exports = new CoffeeController();
