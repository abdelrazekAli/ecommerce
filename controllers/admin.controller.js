const fs = require("fs");
const { validationResult } = require("express-validator");

// Import models
const cartModel = require("../models/cart.model");
const userModel = require("../models/auth.model");
const productModel = require("../models/product.model");

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
  let { name, price, category, description } = req.body;

  // Check is any validation error
  if (validationResult(req).isEmpty()) {
    productModel
      .addNewProduct({
        name: name,
        price: price,
        category: category,
        description: description,
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
        console.log(err);
        next(err);
      });
  } else {
    req.flash("validationResult", validationResult(req).array());
    res.redirect("/admin/addProduct");
  }
};

exports.getManageOrders = (req, res, next) => {
  const { email } = req.query;
  const statusOptions = ["Pending", "Sent", "Completed"];

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
              statusOptions: statusOptions,
            });
          });
        } else {
          res.render("manageOrders", {
            isUser: true,
            isAdmin: true,
            pageTitle: "Manage Orders",
            searchError: "This email does not has any orders",
            statusOptions: statusOptions,
          });
        }
      })
      .catch((err) => {
        console.log(err);
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
            statusOptions: statusOptions,
          });
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
};

exports.statusEditing = (req, res, next) => {
  let { orderId, status } = req.body;
  if (status) {
    cartModel
      .statusEditing(orderId, status)
      .then(() => {
        res.redirect("/admin/manageOrders");
      })
      .catch((err) => {
        console.log(err);
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

exports.updateProduct = async (req, res, next) => {
  if (req.file) {
    let imageName = req.file.filename;
    let { productId, name, price, category, description } = req.body;
    productModel
      .updateProduct({
        productId: productId,
        name: name,
        price: price,
        category: category,
        description: description,
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

exports.deleteProduct = (req, res, next) => {
  let { productId } = req.body;
  let image = req.body.image[1];
  productModel
    .deleteProduct(productId)
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
