const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");
const userModel = require("../models/auth.model");
const validationResult = require("express-validator").validationResult;

exports.getaddProduct = (req, res, next) => {
  res.render("addProduct", {
    isUser: true,
    isAdmin: true,
    pageTitle: "Add Product",
    productAdded: false,
    validationResult: req.flash("validationResult"),
  });
};

exports.postaddProduct = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    productModel
      .addNewProduct({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        image: req.file.filename,
      })
      .then(() => {
        res.render("addProduct", {
          isUser: true,
          isAdmin: true,
          pageTitle: "Add Product",
          productAdded: true,
          validationResult: req.flash("validationResult"),
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    req.flash("validationResult", validationResult(req).array());
    res.redirect("/admin/addProduct");
  }
};

exports.getManageOrders = (req, res, next) => {
  let email = req.query.email;
  if (email) {
    userModel
      .searchEmail(req.query.email)
      .then((user) => {
        if (user) {
          cartModel.filterByEmail(user._id).then((filterOrders) => {
            res.render("manageOrders", {
              isUser: true,
              isAdmin: true,
              pageTitle: "Manage Orders",
              orders: filterOrders,
              users: user,
              statusOptions: ["Pending", "Sent", "Completed"],
            });
          });
        } else {
          res.render("manageOrders", {
            isUser: true,
            isAdmin: true,
            pageTitle: "Manage Orders",
            searchError: "This email does not has any orders",
            statusOptions: ["Pending", "Sent", "Completed"],
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    cartModel
      .getAllOrders()
      .then((ordersData) => {
        userModel.getUsersDate().then((userData) => {
          res.render("manageOrders", {
            isUser: true,
            isAdmin: true,
            pageTitle: "Manage Orders",
            orders: ordersData,
            users: userData,
            statusOptions: ["Pending", "Sent", "Completed"],
          });
        });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.statusEditing = (req, res, next) => {
  if (req.body.status) {
    cartModel
      .statusEditing(req.body.orderId, req.body.status)
      .then(() => {
        res.redirect("/admin/manageOrders");
      })
      .catch((err) => {
        next(err);
      });
  }
};
