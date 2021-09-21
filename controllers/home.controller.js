const productsModel = require("../models/product.model");

exports.getHome = (req, res, next) => {
  let category = req.query.category;
  let { userId, isAdmin, active, completeActive, emailSent } = req.session;
  let validCategories = ["clothes", "computers", "cups", "watches"];

  // Check category to filter products
  if (category && validCategories.includes(category)) {
    productsModel.getByCategory(category).then((products) => {
      res.render("index", {
        products: products,
        isUser: userId,
        isAdmin: isAdmin,
        pageTitle: "Home",
        activeEmail: active,
        completeActive: completeActive,
        emailSent: emailSent,
        validationResult: req.flash("validationResult")[0],
      });
    });
  } else {
    productsModel.getAllProducts().then((products) => {
      res.render("index", {
        products: products,
        isUser: userId,
        isAdmin: isAdmin,
        pageTitle: "Home",
        emailSent: emailSent,
        activeEmail: active,
        completeActive: completeActive,
        validationResult: req.flash("validationResult")[0],
      });
    });
  }
};
