const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv").config();
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const homeRouter = require("./routes/home.route");
const productRouter = require("./routes/product.route");
const authRouter = require("./routes/auth.route");
const cartRouter = require("./routes/cart.route");
const adminRouter = require("./routes/admin.route");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.use(flash());

const STORE = new SessionStore({
  uri: process.env.DATABASE_URL,
  collection: "sessions",
});
app.use(
  session({
    secret: "3bdelrazek Ecommerce website Session",
    saveUninitialized: false,
    store: STORE,
    resave: true,
  })
);

app.use("/", homeRouter);
app.use("/product", productRouter);
app.use(authRouter);
app.use("/cart", cartRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/error", (req, res, next) => {
  res.status(500);
  res.render("error", {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin,
    pageTitle: "Error",
  });
});

app.use((error, req, res, next) => {
  res.redirect("/error");
});

app.get("/notAdmin", (req, res, next) => {
  res.status(403);
  res.render("notAdmin", {
    isUser: req.session.userId,
    isAdmin: false,
    pageTitle: "Error",
  });
});

app.use((req, res, next) => {
  res.status(404);
  res.render("notFound", {
    isUser: req.session.userId,
    isAdmin: false,
    pageTitle: "Error",
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is listen on port " + port);
});
