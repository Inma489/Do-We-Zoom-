var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const userModel = require("../model/userModel");
const photoModel = require("../model/photoModel");
const multer = require("multer");

// List all users,for this ,we will use router.get

router.get("/", async (req, res) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log(token);
  try {
    const verification = jwt.verify(token, "mysecret");
    console.log(verification);

    if (!verification.admin) {
      // if you are not an admin show me this:

      //with the async and with the await I don't have to put (.then).
      const users = await userModel.find(
        {},
        { _id: 1, username: 1, email: 1, avatar: 1 }
      );
      // the 1 is for you to show me things
      //and 0 is when I don't want you to show them to me.
      res.send(users);
    } else {
      //if you are an admin show me this:
      const users = await userModel.find(
        {},
        { _id: 1, username: 1, email: 1, avatar: 1 }
      );
      res.send(users);
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("You don't have permission");
  }
});

//Show user by id
router.get("/:id", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  try {
    const verification = jwt.verify(token, "mysecret");
    console.log(token);
    console.log(verification);
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    res.send(user);
  } catch (e) {
    res.status(401).send("You don't have permission " + e);
  }
});

//destination where the photos will go and be saved
//with a filename in uploads and the defined folder.
var avatarStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file !== "") {
      cb(null, "public/uploads/avatars/");
    } else {
      console.log("There is no file to create the avatar.");
    }
  },
  filename: function(req, file, cb) {
    if (file !== "") {
      let nombreImage = file.originalname.split(".");
      let extension = nombreImage[nombreImage.length - 1];
      if (req.body._id === "") {
        cb(null, Date.now() + "." + extension);
      } else {
        cb(null, req.body._id + "." + extension);
      }
    } else {
      console.log("file is empty or does not exist.");
    }
  }
});

//Here, we create/add a user.

router.post(
  "/add",
  multer({ storage: avatarStorage }).single("file"),
  async (req, res) => {
    const newUser = req.body;
    console.log(newUser);
    try {
      const user = await new userModel({
        //here, we create a new user.
        username: newUser.username,
        email: newUser.email,
        ...(req.file && { avatar: req.file.filename }),
        ...(req.file &&
          req.file.filename != "" && { avatar: req.file.filename }),
        ...(!req.file && { avatar: "" }),
        password: md5(newUser.password)
      });
      user.save((error, result) => {
        //here I handle errors, if you give an error show me.
        if (error) {
          if (error.code === 11000) {
            console.log(error);
            // username already exist with this error.

            res.status(400).send({ e: error });
          } else {
            res.status(400).send("error " + error.errmsg[0]);
          }
        }
        console.log(result);
        res.send(result);
      });
    } catch (err) {
      res.status(401).send("Sorry, you don't have permission" + err);
    }
  }
);

// here we will edit a user, if you are an administrator you can edit the user and yourself
//and if you are a user you can edit only yourself.

router.put(
  "/:id",
  multer({ storage: avatarStorage }).single("file"),
  async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const idUser = req.params.id;
    const editUser = req.body;
    console.log(token);
    try {
      const verification = jwt.verify(token, "mysecret"); // verification token
      // If you're an administrator or id matches the user, you'll be able to edit.
      if (verification.admin || verification._id == idUser) {
        //here I find the user by the id and updates it.
        await userModel.findOneAndUpdate(
          { _id: idUser },
          {
            ...(editUser.username != null && { username: editUser.username }),
            ...(editUser.email != null && { email: editUser.email }),
            ...(req.file && { avatar: req.file.filename }),
            ...(editUser.password != null &&
              editUser.password.length > 0 && {
                password: md5(editUser.password)
              })
          }
        );

        const user = await userModel.findById(idUser, { password: 0 });
        //idUser will never be enclosed in braces here, because it does not return an object.

        res.send(user);
      } else {
        res
          .status(403)
          .send("Sorry you are not an admin or you are not de correct user");
      }
    } catch (error) {
      res.status(401).send("Sorry you don't have permission" + error);
    }
  }
);

// here I want to delete the user and all the photos you have,
//that is, delete your account.

router.delete("/:id", (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const idUser = req.params.id;
    let verification = jwt.verify(token, "mysecret");
    if (verification.admin || verification._id == idUser) {
      userModel.deleteOne({ _id: idUser }, (err, result) => {
        if (err) throw err;
      });
      photoModel.deleteMany({ owner: idUser }, (err, result) => {
        if (err) throw err;
      });
      res.send();
    } else {
      res.send("Sorry, you don't haver permission to delete");
    }
  } catch (err) {
    res
      .status(401)
      .send("Sorry, you don't have permission your Token is not valid " + err);
  }
});
module.exports = router;
