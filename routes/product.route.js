const router = require("express").Router();
const productController = require("../controllers/product.controller");
const homeController = require("../controllers/home.controller");
const authGuard = require("../routes/guards/auth.guard");

router.get("/", homeController.getHome);
router.get("/:id", productController.getProductById);

module.exports = router;
