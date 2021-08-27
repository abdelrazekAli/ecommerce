const productModel = require("../models/product.model");

exports.getProductById = (req, res, next) => {
  let id = req.params.id;
  productModel.getProductById(id).then((product) => {
    res.render("product", {
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
      pageTitle: "Product",
      product: product,
      validationResult: req.flash("validationResult")[0],
    });
  });
};
