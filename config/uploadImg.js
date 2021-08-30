const multer = require("multer");
const path = require("path");

exports.storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.fileFilter = (req, file, callback) => {
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
};
