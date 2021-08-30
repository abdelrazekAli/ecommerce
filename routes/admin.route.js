const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const adminController = require("../controllers/admin.controller");
const check = require("express-validator").check;
const adminGuard = require("../routes/guards/auth.guard");

router.get("/addProduct", adminGuard.isAdmin, adminController.getaddProduct);
router.post(
  "/addProduct",
  adminGuard.isAdmin,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "images");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
      },
    }),
  }).single("image"),
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
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "images");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
      },
    }),
    fileFilter: (req, file, callback) => {
      var ext = path.extname(file.originalname);
      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".JPG" &&
        ext !== ".gif" &&
        ext !== ".jpeg"
      ) {
        return callback(new Error("Only images are allowed"));
      }
      callback(null, true);
    },
  }).single("image"),
  adminController.updateProduct
);
module.exports = router;
