var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var md5 = require("md5");
const mongodb = require("mongodb");
//API AUTH
// primero haremos el aPi/auth para saber si al logearnos existimos
//en la base de datos
const userModel = require("../model/userModel");

router.post("/", function(req, res) {
  const user = userModel.find({
    email: req.body.email,
    password: md5(req.body.password)
  });
  
  user.then(document => {
    // no nos hace falta generar un array puesto que con la constante que hemos
    //genereado arriba ya me devuelve un array
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
  })
});


// modelo miguel angel

// controller.auth = (req, res) => {
//   userModel
//     .find({
//       email: req.body.email,
//       password: md5(req.body.password)
//     })
//     .then(result => {
//       if (result.length > 0) {
//         var token = jwt.sign(
//           {
//             id: result[0]._id,
//             email: result[0].email,
//             name: result[0].name,
//             isAdmin: result[0].isAdmin ? true : false
//           },
//           "mysecret"
//         );
//         res.send(token);
//       } else {
//         res.status(400).send("Invalid credentials");
//       }
//     });
// };

module.exports = router;




