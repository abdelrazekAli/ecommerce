const mongoose = require("mongoose");
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const productSchema = mongoose.Schema({
  name: String,
  price: String,
  category: String,
  description: String,
  image: String,
});

const Product = mongoose.model("product", productSchema);

exports.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URL, connectOptions)
      .then(() => {
        return Product.find({});
      })
      .then((products) => {
        mongoose.disconnect();
        resolve(products);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.getByCategory = (category) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URL, connectOptions)
      .then(() => {
        return Product.find({ category: category });
      })
      .then((products) => {
        mongoose.disconnect();
        resolve(products);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
exports.getProductById = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URL, connectOptions)
      .then(() => {
        return Product.findById(id);
      })
      .then((product) => {
        mongoose.disconnect();
        resolve(product);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
exports.addNewProduct = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URL, connectOptions)
      .then(() => {
        let newProduct = new Product(data);
        return newProduct.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
