const router = require("express").Router();
const cartController = require("../controllers/cart.controller");
const bodyParser = require("body-parser").urlencoded({ extended: true });
const check = require("express-validator").check;
const authGuard = require("../routes/guards/auth.guard");
router.get("/", authGuard.isUser, cartController.getCart);
router.post(
  "/",
  authGuard.isUser,
  bodyParser,
  check("amount")
    .not()
    .isEmpty()
    .withMessage("Cart amount is required")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Cart amount must be between 0 and 1000"),
  cartController.postCart
);
router.post(
  "/save",
  authGuard.isUser,
  bodyParser,
  check("amount")
    .not()
    .isEmpty()
    .withMessage("Cart amount is required")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Cart amount must be between 0 and 1000"),
  cartController.updateProduct
);
router.post("/delete", authGuard.isUser, bodyParser, cartController.deleteCart);
router.post(
  "/deleteAll",
  authGuard.isUser,
  bodyParser,
  cartController.deleteAllCart
);
router.post(
  "/deleteOrder",
  authGuard.isUser,
  bodyParser,
  cartController.deleteOrder
);
router.post(
  "/deleteAllOrders",
  authGuard.isUser,
  bodyParser,
  cartController.deleteAllOrders
);
router.get("/verifyOrders", authGuard.isUser, cartController.getverifyOrders);
router.post(
  "/verifyOrders",
  authGuard.isUser,
  bodyParser,
  cartController.postverifyOrders
);

router.get("/orders", authGuard.isUser, cartController.getOrders);
router.post(
  "/orders",
  authGuard.isUser,
  bodyParser,
  check("address")
    .not()
    .isEmpty()
    .withMessage("Address is required")
    .isLength({ min: 3, max: 1000 })
    .withMessage("Address is not valid"),
  check("phone")
    .not()
    .isEmpty()
    .withMessage("Phone number is required")
    .isInt()
    .withMessage("Phone number is not valid")
    .isLength({ min: 3, max: 20 })
    .withMessage("Phone number is not valid"),
  cartController.postOrders
);
module.exports = router;
