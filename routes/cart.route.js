const router = require("express").Router();
const check = require("express-validator").check;
const { isUser } = require("../routes/guards/auth.guard");
const cartController = require("../controllers/cart.controller");

router.get("/", isUser, cartController.getCart);

router.post(
  "/",
  isUser,
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
  isUser,
  check("amount")
    .not()
    .isEmpty()
    .withMessage("Cart amount is required")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Cart amount must be between 0 and 1000"),
  cartController.updateProduct
);

router.post("/delete", isUser, cartController.deleteCart);

router.post("/deleteAll", isUser, cartController.deleteAllCart);

router.post("/deleteOrder", isUser, cartController.deleteOrder);

router.post("/deleteAllOrders", isUser, cartController.deleteAllOrders);

router.post("/deleteAllUserOrders", isUser, cartController.deleteAllUserOrders);

router.get("/verifyOrders", isUser, cartController.getverifyOrders);
router.post("/verifyOrders", isUser, cartController.postverifyOrders);

router.get("/orders", isUser, cartController.getOrders);
router.post(
  "/orders",
  isUser,
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

// Payment routes
router.get("/payment", isUser, cartController.getPayment);
router.post("/payment/pay", isUser, cartController.paypal);
router.get("/payment/pay/success", cartController.paypalSuccess);
router.get("/payment/pay/cancel", cartController.paypalCancel);

module.exports = router;
