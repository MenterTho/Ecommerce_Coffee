const Coffee = require("../models/Coffee");
const { mongooseToObject } = require("../../util/mongoose");
class CoffeeController {
  // [GET] /:slug
  show(req, res, next) {
    const title = "Infomations";
    res.locals.session = req.session;
    Coffee.findOne({ slug: req.params.slug })
      .then((coffee) => {
        res.render("coffees/show", {
          title,
          coffee: mongooseToObject(coffee),
        });
      })
      .catch(next);
  }
  // [GET] /coffees/create
  create(req, res, next) {
    res.locals.session = req.session;
    const title = "Create-Coffee";
    res.render("coffees/create", { title });
  }
  // [POST] /coffees/store
  store(req, res, next) {
    res.locals.session = req.session;
    const coffee = new Coffee(req.body);
    coffee
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        res.status(400).send("Name này đã tồn tại");
        next(err);
      });
  }
}
module.exports = new CoffeeController();
