const fs = require("fs");
const path = require("path");
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
        userModel.getUsersData().then((userData) => {
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

exports.getManageProducts = (req, res, next) => {
  productModel
    .getAllProducts()
    .then((products) => {
      res.render("manageProducts", {
        isUser: true,
        isAdmin: true,
        pageTitle: "Manage Products",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  let id = req.body.productId;
  let image = req.body.image;
  productModel
    .deleteProduct(id)
    .then(() => {
      fs.unlink(`images/${image}`, () => {
        console.log("Deleted.");
      });
    })
    .then(() => {
      res.redirect("/admin/manageProducts");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.deleteAllProducts = (req, res, next) => {
  productModel
    .deleteAllProducts()
    .then(() => {
      fs.readdir("images", (err, files) => {
        if (err) next(err);
        for (let file of files) {
          fs.unlink(`images/${file}`, () => {
            console.log("Deleted.");
          });
        }
      });
    })
    .then(() => {
      res.redirect("/admin/manageProducts");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.updateProduct = async (req, res, next) => {
  if (req.file) {
    let imageName = req.file.filename;
    productModel
      .updateProduct({
        productId: req.body.productId,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        image: imageName,
      })
      .then(() => {
        let oldImg = `images/${req.body.image}`;
        if (fs.existsSync(oldImg)) {
          fs.unlink(oldImg, () => {
            res.redirect("/admin/manageProducts");
          });
        }
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } else {
    let productData = req.body;
    productModel
      .updateProduct(productData)
      .then(() => {
        res.redirect("/admin/manageProducts");
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
};
