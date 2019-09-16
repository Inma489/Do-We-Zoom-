var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var md5 = require("md5");
const mongodb = require("mongodb");

//API AUTH
// first,we will do it the aPi/auth to know if when we login we exist in the database.
const userModel = require("../model/userModel");

router.post("/", function(req, res) {
  const user = userModel.find({
    email: req.body.email,
    password: md5(req.body.password)
  });

  user.then(document => {
    if (document.length > 0) {
      var token = jwt.sign(
        {
          _id: document[0]._id,
          email: document[0].email,
          username: document[0].username,
          admin: document[0].admin ? true : false
        },
        "mysecret"
      );

      res.send(token);
    } else {
      res.status(400).send("Invalid credentials");
    }
  });
});

module.exports = router;
