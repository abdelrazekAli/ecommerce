const path = require("path");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");

// Create storage engine
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
