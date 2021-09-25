const express = require("express");
const app = express();
const path = require("path");
const flash = require("connect-flash");
const paypal = require("paypal-rest-sdk");
const dotenv = require("dotenv").config();
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);

// Import Routes
const homeRouter = require("./routes/home.route");
const productRouter = require("./routes/product.route");
const authRouter = require("./routes/auth.route");
const cartRouter = require("./routes/cart.route");
const adminRouter = require("./routes/admin.route");

// Set template engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));

// Setup session
const STORE = new SessionStore({
  uri: process.env.DB_URL,
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

// Setup paypal sandbox
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// Routes Middlewares
app.use(authRouter);
app.use("/", homeRouter);
app.use("/product", productRouter);
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
    isAdmin: req.session.isAdmin,
    pageTitle: "Not Found",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listen on port : ${port}`);
});
