const productModel = require("../models/product.model");

exports.getProductById = (req, res, next) => {
  let { id } = req.params;
  let { userId, isAdmin } = req.session;
  productModel.getProductById(id).then((product) => {
    res.render("product", {
      isUser: userId,
      isAdmin: isAdmin,
      pageTitle: "Product",
      product: product,
      validationResult: req.flash("validationResult")[0],
    });
  });
};
