//jshint esversion:6
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// to connect database
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
const userSchema = {
  email: String,
  password: String,
};
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
  //   newUser.save((err) => {
  //     if (err) console.log(err);
  //     else res.render("secrets.ejs");
  //   });
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
