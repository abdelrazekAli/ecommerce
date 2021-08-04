const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const DB_URL =
  "mongodb+srv://abdelrazek:abdelrazek@cluster0.ya7t9.mongodb.net/ecommerce-store?retryWrites=true&w=majority";

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
let User = mongoose.model("user", userSchema);
exports.createNewUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (user) reject("Email is already used");
        else return bcrypt.hash(password, 10);
      })
      .then((hashedPassword) => {
        let newUser = new User({
          username: username,
          email: email,
          password: hashedPassword,
        });
        newUser.save((err, result) => {
          console.log(err);
          mongoose.disconnect();
          resolve();
        });
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("There is no user matches this email");
        } else {
          bcrypt.compare(password, user.password).then((same) => {
            if (!same) {
              mongoose.disconnect();
              reject("Password is incorrect");
            } else {
              mongoose.disconnect();
              resolve(user);
            }
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
exports.getUsersDate = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.find({});
      })
      .then((userData) => {
        mongoose.disconnect();
        resolve(userData);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.searchEmail = (mail) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.findOne({ email: mail });
      })
      .then((userData) => {
        mongoose.disconnect();
        resolve(userData);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
