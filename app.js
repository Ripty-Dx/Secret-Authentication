require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//step 1:  to connect database
mongoose
  .connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

// Step:2 to create schema i.e structure of document
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Security
// optional step
// encryption for passwords in database storage
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

//step:3 model creation: an interface for CRUD operations
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser
    .save()
    .then(() => {
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  User.findOne({ email: username })
    .then((foundUser) => {
      console.log(foundUser);

      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          console.log("Incorrect password");
          res.render("login");
        }
      } else res.render("login");
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/submit", (req, res) => {
  res.render("submit");
});
app.post("/submit", (req, res) => {
  // res.render("submit");
});
app.listen(5000, () => {
  console.log("server is running on port 5000");
});
