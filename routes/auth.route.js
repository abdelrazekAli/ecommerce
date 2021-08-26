const router = require("express").Router();
const check = require("express-validator").check;
const authController = require("../controllers/auth.controller");
const authGuard = require("../routes/guards/auth.guard");

router.get("/signup", authGuard.isNotUser, authController.getSignup);
router.post(
  "/signup",
  authGuard.isNotUser,
  check("username").not().isEmpty().withMessage("Username is required"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be more than 6 characters"),
  check("confirmPassword").custom((value, { req }) => {
    if (value === req.body.password) return true;
    else throw "Passwords not the same";
  }),
  authController.postSignup
);
router.get("/login", authGuard.isNotUser, authController.getLogin);
router.post(
  "/login",
  authGuard.isNotUser,
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be more than 6 characters"),
  authController.postLogin
);

router.all("/VerifyEmail/:code", authController.verifyEmail);
router.post("/SendVerifyEmail", authController.sendVerifyEmail);

router.all("/logout", authController.logout);
module.exports = router;
