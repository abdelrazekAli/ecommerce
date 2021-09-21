const router = require("express").Router();
const multer = require("multer");
const adminController = require("../controllers/admin.controller");
const check = require("express-validator").check;
const adminGuard = require("../routes/guards/auth.guard");

const { storage } = require("../config/uploadImg");
const upload = multer({ storage });

router.get("/addProduct", adminGuard.isAdmin, adminController.getaddProduct);
router.post(
  "/addProduct",
  adminGuard.isAdmin,
  upload.single("file"),
  check("name").not().isEmpty().withMessage("Name is required"),
  check("price")
    .not()
    .isEmpty()
    .withMessage("Price is required")
    .isInt({ min: 0, max: 100000 })
    .withMessage("Price must be between 0 and 100000"),
  check("description").not().isEmpty().withMessage("Description is required"),
  check("category").not().isEmpty().withMessage("Category is required"),
  check("file").custom((value, { req }) => {
    if (req.file) return true;
    else throw "Image is required";
  }),
  adminController.postaddProduct
);
router.get(
  "/manageOrders",
  adminGuard.isAdmin,
  adminController.getManageOrders
);
router.post(
  "/statusEditing",
  adminGuard.isAdmin,
  adminController.statusEditing
);
router.get(
  "/manageProducts",
  adminGuard.isAdmin,
  adminController.getManageProducts
);
router.post(
  "/deleteProduct",
  adminGuard.isAdmin,
  adminController.deleteProduct
);
router.post(
  "/deleteAllProducts",
  adminGuard.isAdmin,
  adminController.deleteAllProducts
);
router.post(
  "/updateProduct",
  adminGuard.isAdmin,
  upload.single("file"),
  adminController.updateProduct
);
module.exports = router;
