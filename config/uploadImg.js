const multer = require("multer");
const path = require("path");

// Multer storage
exports.storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filter images
exports.fileFilter = (req, file, callback) => {
  const imgExtension = path.extname(file.originalname);
  const allowedExtension = [".png", ".jpg", ".JPG", ".jpeg", ".svg", ".webp"];

  if (!allowedExtension.includes(imgExtension))
    return callback(new Error("Only images are allowed"));
  callback(null, true);
};
