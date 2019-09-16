var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const photoModel = require("../model/photoModel");
const userModel = require("../model/userModel");
const multer = require("multer");

//We will get list of photos.
//Both, the admin can list photos and the user will be able to see list of photos.

router.get("/", async (req, res) => {
  // req.headers.authorization // returns the token to us.
  console.log(req.headers.authorization);
  // here we verify that the token we are sending is correct or not.

  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    let verification = jwt.verify(token, "mysecret");

    if (!verification.admin) {
      // if you're not admin show me this:
      //with the async and with the await I no longer have to put the .then

      const photo = await photoModel.find(
        {},
        {
          _id: 1,
          filename: 1,
          owner: 1,
          name: 1,
          dateAdded: 1,
          camera: 1,
          localization: 1
        }
      );
      //the 1 is for you to show me things
      //and 0 is when I don't want you to show them to me.
      res.send(photo);
    } else {
      // if you are an admin show me this:
      const photo = await photoModel.find(
        {},
        {
          _id: 1,
          owner: 1,
          filename: 1,
          name: 1,
          dateAdded: 1,
          camera: 1,
          localization: 1
        }
      );
      res.send(photo);
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("You don't have permission to get photos");
  }
});

// photos uploaded by users will be saved to the database with the filename.

var photosStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/photos/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "." + file.originalname.split(".").slice(-1));
  }
});

//Now we will create/add a photo with multer.

router.post(
  "/add",
  multer({ storage: photosStorage }).single("file"),
  async (req, res) => {
    //I will fail the token to create/add photos.

    const token = req.headers.authorization.replace("Bearer ", "");
    const newPhoto = req.body;
    console.log("newPhoto");

    try {
      let verification = jwt.verify(token, "mysecret");
      console.log(verification);

      if (!verification.admin) {
        const photo = await new photoModel({
          //here,we create a new photo.
          ...(newPhoto.name != null && { name: newPhoto.name }),
          camera: newPhoto.camera,
          ...(req.file &&
            req.file.filename != "" && { filename: req.file.filename }),
          ...(!req.file && { filename: "" }),
          ...(newPhoto.localization != null && {
            localization: newPhoto.localization
          }),
          owner: verification._id
        });
        console.log(photo);
        photo.save((error, result) => {
          //here, I handle errors if I fail to show it.
          if (error) {
            if (error.code === 11000) {
              console.log(error);
              res.send("this name of photo already exist.");
            } else {
              res.send("error " + error.errmsg[0]);
            }
          }
          console.log(result);
          res.send(result);
        });
      } else {
        res.send("You're not an user, you can't add photos");
      }
    } catch (err) {
      res
        .status(401)
        .send("Sorry, you don't have permission to add photos" + err);
    }
  }
);

//Now, I will edit a photo only if you are a user you can edit, if you are admin,no.

router.put(
  "/:id",
  multer({ storage: photosStorage }).single("file"),
  async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const idPhoto = req.params.id;
    const editPhoto = req.body;
    console.log(token);
    try {
      let verification = jwt.verify(token, "mysecret"); // verification token
      if (!verification.admin) {
        // if you are a user, you can edit.
        await photoModel.findOneAndUpdate(
          {
            _id: idPhoto
          },
          {
            name: editPhoto.name,
            ...(req.file && { filename: req.file.filename }),
            camera: editPhoto.camera,
            localization: editPhoto.localization
          }
        );

        const photo = await photoModel.findById(idPhoto);
        res.send(photo);
      } else {
        res.status(403).send("Sorry you are not an user, you can't edit photo");
      }
    } catch (err) {
      console.log(err);
      res.status(401).send("Sorry you don't have permission");
    }
  }
);

//here, we will delete a photo, the admin may delete it and the user too.

router.delete("/:id", (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const idPhoto = req.params.id;
  try {
    let verification = jwt.verify(token, "mysecret");
    if (verification.admin) {
      photoModel.findOneAndDelete({ _id: idPhoto }, (error, result) => {
        if (error) throw err;
      });
    } else {
      photoModel.findOneAndDelete(
        { _id: idPhoto, owner: verification._id },
        (error, result) => {
          if (error) throw err;
        }
      );
    }
    res.send("delete photo");
  } catch (error) {
    res
      .status(401)
      .send("Sorry, you don't have permission your Token is not valid");
  }
});

module.exports = router;
