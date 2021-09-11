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
      .connect(process.env.DB_URL, connectOptions)
      .then(() => {
        return Product.find({});
      })
      .then((products) => {
        resolve(products);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getByCategory = (category) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, connectOptions)
      .then(() => {
        return Product.find({ category: category });
      })
      .then((products) => {
        resolve(products);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getProductById = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, connectOptions)
      .then(() => {
        return Product.findById(id);
      })
      .then((product) => {
        resolve(product);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.addNewProduct = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, connectOptions)
      .then(() => {
        let newProduct = new Product(data);
        return newProduct.save();
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, connectOptions)
      .then(() => {
        return Product.deleteOne({ _id: id });
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

exports.deleteAllProducts = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, connectOptions)
      .then(() => {
        return Product.deleteMany({});
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.updateProduct = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, connectOptions)
      .then(() => {
        return Product.updateOne(
          { _id: data.productId },
          {
            name: data.name,
            price: data.price,
            category: data.category,
            description: data.description,
            image: data.image,
          }
        );
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
