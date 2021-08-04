const productsModel = require("../models/product.model");
const validationResult = require("express-validator").validationResult;

exports.getHome = (req, res, next) => {
  let category = req.query.category;
  let validCategories = ["clothes", "computers", "cups", "watches"];
  if (category && validCategories.includes(category)) {
    productsModel.getByCategory(category).then((products) => {
      res.render("index", {
        products: products,
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Home",
        validationResult: req.flash("validationResult")[0],
      });
    });
  } else {
    productsModel.getAllProducts().then((products) => {
      res.render("index", {
        products: products,
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Home",
        validationResult: req.flash("validationResult")[0],
      });
    });
  }
};
