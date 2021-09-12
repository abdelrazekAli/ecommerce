const cartModel = require("../models/cart.model");
const validationResult = require("express-validator").validationResult;
const paypal = require("paypal-rest-sdk");
const logger = require("../config/logger");

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

exports.deleteAllUserOrders = (req, res, next) => {
  userId = req.body.userId;
  cartModel
    .deleteAllUserOrders(userId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      next(err);
    });
};

exports.getverifyOrders = (req, res, next) => {
  cartModel
    .getCart(req.session.userId)
    .then((data) => {
      res.render("verifyOrders", {
        isUser: true,
        isAdmin: req.session.isAdmin,
        pageTitle: "Verify Orders",
        products: data,
        validationResult: req.flash("validationResult"),
      });
      req.flash("orderData", data);
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/cart");
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
      userId: req.session.userId,
      pageTitle: "Orders",
      products: productsData,
      successPayment: req.flash("success"),
      failPayment: req.flash("failPayment"),
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
        res.redirect("/cart/payment");
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

exports.getPayment = (req, res, next) => {
  cartModel.printOrders(req.session.userId).then((productsData) => {
    let filterProducts = productsData.filter((product) => {
      return product.payment != true;
    });
    let totalCost = filterProducts.reduce((current, product) => {
      return product.price * product.amount + current;
    }, 0);
    res.render("payment", {
      isUser: true,
      isAdmin: req.session.isAdmin,
      pageTitle: "Orders",
      products: filterProducts,
      totalCost: totalCost,
    });
  });
};

exports.paypal = (req, res, next) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `${process.env.HOST_LINK}cart/payment/pay/success`,
      cancel_url: `${process.env.HOST_LINK}cart/payment/pay/cancel`,
    },
    transactions: [
      {
        amount: {
          currency: "USD",
          total: `${req.body.totalCost}`,
        },
        description: "total user orders cost",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

exports.paypalSuccess = (req, res, next) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  paypal.payment.execute(
    paymentId,
    { payer_id: payerId },
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        logger.info(payment);
        cartModel
          .updatePayment(req.session.userId)
          .then(() => {
            req.flash("success", "Successfully payment");
            res.redirect("/cart/orders");
          })
          .catch((err) => next(err));
      }
    }
  );
};

exports.paypalCancel = (req, res, next) => {
  res.flash("failPayment", "Payment failed");
  res.redirect("/cart/orders");
};
