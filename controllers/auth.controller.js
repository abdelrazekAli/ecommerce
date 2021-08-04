const validationResult = require("express-validator").validationResult;
const authModel = require("../models/auth.model");

exports.getSignup = (req, res, next) => {
  res.render("signup", {
    isUser: req.session.userId,
    isAdmin: false,
    pageTitle: "Signup",
    signupError: req.flash("signupError")[0],
    validationErrors: req.flash("validationErrors"),
  });
};

exports.postSignup = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    authModel
      .createNewUser(req.body.username, req.body.email, req.body.password)
      .then(() => {
        res.render("login", {
          isUser: req.session.userId,
          isAdmin: false,
          pageTitle: "Login",
          accountCreated: true,
          authError: req.flash("authError")[0],
          validationErrors: req.flash("validationErrors"),
        });
      })
      .catch((err) => {
        req.flash("signupError", err);
        res.redirect("/signup");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/signup");
  }
};

exports.getLogin = (req, res, next) => {
  res.render("login", {
    isUser: req.session.userId,
    isAdmin: false,
    pageTitle: "Login",
    accountCreated: false,
    authError: req.flash("authError")[0],
    validationErrors: req.flash("validationErrors"),
  });
};

exports.postLogin = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    authModel
      .login(req.body.email, req.body.password)
      .then((user) => {
        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin;
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("authError", err);
        res.redirect("/login");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/login");
  }
};
exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
