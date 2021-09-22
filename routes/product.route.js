const router = require("express").Router();

// Import controllers
const homeController = require("../controllers/home.controller");
const productController = require("../controllers/product.controller");

router.get("/", homeController.getHome);
router.get("/:id", productController.getProductById);

module.exports = router;
