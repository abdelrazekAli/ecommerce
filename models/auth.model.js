const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { getUserCode } = require("../util/utility");
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.set("useFindAndModify", false);

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  codeActivation: String,
});

let User = mongoose.model("user", userSchema);

exports.createNewUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, connectOptions)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (user) {
          mongoose.disconnect();
          reject("Email is already used");
        } else return bcrypt.hash(password, 10);
      })
      .then((hashedPassword) => {
        let newUser = new User({
          username: username,
          email: email,
          password: hashedPassword,
          codeActivation: getUserCode(),
        });
        newUser.save((err, result) => {
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
      .connect(process.env.DB_URL, connectOptions)
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

exports.getUsersData = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, connectOptions)
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
      .connect(process.env.DB_URL, connectOptions)
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

exports.activateUser = (id, code) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, connectOptions)
      .then(() => {
        return User.findOne({
          _id: mongoose.Types.ObjectId(id),
          codeActivation: code,
        });
      })
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("Code is incorrect");
        } else {
          return User.findByIdAndUpdate(id, { active: true });
        }
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
