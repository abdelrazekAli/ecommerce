const { sendMail } = require("../util/utility");
const authModel = require("../models/auth.model");
const validationResult = require("express-validator").validationResult;

exports.getSignup = (req, res, next) => {
  res.render("signup", {
    isUser: req.session.userId,
    isAdmin: false,
    pageTitle: "Signup",
    signupError: req.flash("signupError")[0],
    inputsValues: req.flash("signupInputValues")[0],
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
          inputsValues: req.flash("loginInputValues")[0],
          validationErrors: req.flash("validationErrors"),
        });
      })
      .catch((err) => {
        req.flash("signupError", err);
        req.flash("signupInputValues", req.body);
        res.redirect("/signup");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    req.flash("signupInputValues", req.body);
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
    inputsValues: req.flash("loginInputValues")[0],
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
        req.session.codeActivation = user.codeActivation;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.active = user.active;
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("loginInputValues", req.body);
        req.flash("authError", err);
        res.redirect("/login");
      });
  } else {
    req.flash("loginInputValues", req.body);
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/login");
  }
};

exports.sendVerifyEmail = (req, res, next) => {
  let hostLink = process.env.HOST_LINK;
  let { codeActivation, username, email } = req.session;
  let html = ` <table style="background:#EEE;padding:40px;border:1px solid #DDD;margin:0 auto;font-family:calibri;">
<tr>
  <td>
    <table
      style="background:#FFF;width:100%;border:1px solid #CCC;padding:0;margin:0;border-collapse:collapse;max-width:100%;width:550px;border-radius:10px;">

      <!-- Welcome Salutation -->
      <tr>
        <td style="padding:10px 30px;margin:0;font-size:2.5em;color:#11366d;text-align:center;">
          Welcome to Our Ecommerce
        </td>
      </tr>
      <!-- User Msg -->
      <tr>
        <td style="padding:10px 30px;margin:0;text-align:left;">
          <p>Hi ${username}</p>
          <p>Your account is created and you should be activated. to activate the account click on the following button
          </p>
        </td>
      </tr>
      <!-- Link Button -->
      <tr>
        <td style="padding:20px;margin:0;text-align:center;">
          <p><a href="${hostLink}VerifyEmail/${codeActivation}" style="background:#11366d;color:#FFF;padding:10px;text-decoration:none;">Activate
              Profile</a></p>
        </td>
      </tr>
    </table>
  </td>
</tr>
</table>
</td>
</tr>
</table>`;
  sendMail(html, email)
    .then(() => {
      req.session.emailSent = true;
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

exports.verifyEmail = (req, res, next) => {
  let code = req.params.code;
  let { userId } = req.session;
  authModel
    .activateUser(userId, code)
    .then(() => {
      req.session.completeActive = true;
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
