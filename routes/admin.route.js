const multer = require("multer");
const router = require("express").Router();
const check = require("express-validator").check;
const { isAdmin } = require("../routes/guards/auth.guard");
const { storage, fileFilter } = require("../config/uploadImg");
const adminController = require("../controllers/admin.controller");

// Setup upload storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.get("/addProduct", isAdmin, adminController.getaddProduct);
router.post(
  "/addProduct",
  isAdmin,
  upload.single("image"),
  check("name").not().isEmpty().withMessage("Name is required"),
  check("price")
    .not()
    .isEmpty()
    .withMessage("Price is required")
    .isInt({ min: 0, max: 100000 })
    .withMessage("Price must be between 0 and 100000"),
  check("description").not().isEmpty().withMessage("Description is required"),
  check("category").not().isEmpty().withMessage("Category is required"),
  check("image").custom((value, { req }) => {
    if (req.file) return true;
    else throw "Image is required";
  }),
  adminController.postaddProduct
);

router.get("/manageOrders", isAdmin, adminController.getManageOrders);

router.post("/statusEditing", isAdmin, adminController.statusEditing);

router.get("/manageProducts", isAdmin, adminController.getManageProducts);

router.post("/deleteProduct", isAdmin, adminController.deleteProduct);

router.post("/deleteAllProducts", isAdmin, adminController.deleteAllProducts);

router.post(
  "/updateProduct",
  isAdmin,
  upload.single("image"),
  adminController.updateProduct
);

module.exports = router;
