const cartModel = require("../models/cart.model");
const validationResult = require("express-validator").validationResult;
exports.getCart = (req, res, next) => {
  cartModel.getCart(req.session.userId).then((productsData) => {
    res.render("cart", {
      isUser: true,
      isAdmin: req.session.isAdmin,
      pageTitle: "Cart",
      products: productsData,
      validationResult: req.flash("validationResult")[0],
    });
  });
};

exports.postCart = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    cartModel
      .addNewItem({
        name: req.body.productName,
        price: req.body.productPrice,
        amount: +req.body.amount,
        userId: req.session.userId,
        productId: req.body.productId,
        timestamp: Date.now(),
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => {
        next(err);
      });
  } else {
    req.flash("validationResult", validationResult(req).array());
    res.redirect(req.body.cartRedirect);
  }
};

exports.deleteCart = (req, res, next) => {
  cartModel
    .deleteProduct(req.body.cartId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteAllCart = (req, res, next) => {
  cartModel
    .deleteAllCart()
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      next(err);
    });
};

exports.getverifyOrders = (req, res, next) => {
  cartModel.getCart(req.session.userId).then((data) => {
    res.render("verifyOrders", {
      isUser: true,
      isAdmin: req.session.isAdmin,
      pageTitle: "Verify Orders",
      products: data,
      validationResult: req.flash("validationResult"),
    });
  });
};

exports.postverifyOrders = (req, res, next) => {
  res.redirect("/cart/verifyOrders");
};

exports.getOrders = (req, res, next) => {
  cartModel.printOrders(req.session.userId).then((productsData) => {
    res.render("orders", {
      isUser: true,
      isAdmin: req.session.isAdmin,
      pageTitle: "Orders",
      products: productsData,
    });
  });
};
exports.postOrders = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    cartModel
      .addToOrders(req.session.userId, {
        address: req.body.address,
        phone: req.body.phone,
        status: "Pending",
        orderDate: new Date().toDateString(),
      })
      .then(() => {
        res.redirect("/cart/orders");
      })
      .catch((err) => {
        next(err);
      });
  } else {
    req.flash("validationResult", validationResult(req).array());
    res.redirect("/cart/verifyOrders");
  }
};

exports.deleteOrder = (req, res, next) => {
  cartModel
    .deleteOrder(req.body.cartId)
    .then(() => {
      res.redirect("/cart/orders");
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteAllOrders = (req, res, next) => {
  cartModel
    .deleteAllOrders()
    .then(() => {
      res.redirect("/cart/orders");
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateProduct = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    cartModel
      .editProduct(req.body.cartId, {
        amount: req.body.amount,
        timestamp: Date.now(),
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => {
        next(err);
      });
  } else {
    req.flash("validationResult", validationResult(req).array());
    res.redirect("/cart");
  }
};
