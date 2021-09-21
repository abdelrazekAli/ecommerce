const path = require("path");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");

// Create storage for upload images
exports.storage = new GridFsStorage({
  url: process.env.DB_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
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
