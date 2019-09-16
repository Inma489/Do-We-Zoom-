var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const multer = require("multer");
const eventModel = require("../model/eventModel");

//List all events that can be edited and deleted
//by the administrator and only viewed by the user.

router.get("/", async (req, res) => {
  console.log(req.headers.authorization);
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const verification = jwt.verify(token, "mysecret");

    if (verification.admin) {
      const event = await eventModel.find(
        {},
        {
          _id: 1,
          filename: 1,
          name: 1,
          date: 1,
          place: 1,
          time: 1,
          description: 1
        }
      );
      res.send(event);
    } else {
      // If you're not admin, show me this:
      const event = await eventModel.find(
        {},
        {
          _id: 0
        }
      );
      res.send(event);
    }
  } catch (error) {
    // if you're not an administrator, or a verified user, send me an error
    //that says you don't have permission to list events.
    console.log(error);
    res.status(401).send("You don't have permission to get events");
  }
});

//SHOW EVENT BY ID
router.get("/:id", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const verification = jwt.verify(token, "mysecret"); // verificacion token

    const eventId = req.params.id;

    const event = await eventModel.findById(eventId);
    res.send(event);
  } catch (err) {
    res.status(401).send("You don't have permission to show this event " + err);
  }
});

//path to save the photos to an uploads folder
//on the server and the database filename.

var eventStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/events/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "." + file.originalname.split(".").slice(-1));
  }
});

//CREATE EVENT

router.post(
  "/add",
  multer({ storage: eventStorage }).single("file"),
  async (req, res) => {
    //I need the token to be able to create events for the admin.
    //The user cannot create events.
    const token = req.headers.authorization.replace("Bearer ", "");
    const newEvent = req.body;
    console.log(newEvent);
    try {
      const verification = jwt.verify(token, "mysecret"); // verification token.

      if (verification.admin) {
        const event = await new eventModel({
          //here,we create a new event.
          ...(newEvent.name != null && { name: newEvent.name }),
          ...(req.file &&
            req.file.filename != "" && { filename: req.file.filename }),
          ...(!req.file && { filename: "" }),
          admin: verification._id,
          ...(newEvent.date != null && { date: newEvent.date }),
          ...(newEvent.place != null && { place: newEvent.place }),
          ...(newEvent.time != null && { time: newEvent.time }),
          ...(newEvent.description != null && {
            description: newEvent.description
          })
        });
        event.save((error, result) => {
          //here I handle errors, if you give me an error we show it.
          if (error) {
            if (error.code === 11000) {
              console.log(error);
              res.send("this event already exist.");
            } else {
              res.send("error " + error.errmsg[0]);
            }
          }
          console.log(result);
          res.send(result);
        });
      } else {
        res.send("You're not an admin, you can't add an event");
      }
    } catch (err) {
      res
        .status(401)
        .send("Sorry, you don't have permission to add event" + err);
    }
  }
);

// Here, we will edit an event, if you are a user you will not be able to edit the event
//and if you are admin if you can do it and modify its photo as well.

router.put(
  "/:id",
  multer({ storage: eventStorage }).single("file"),
  async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const idEvent = req.params.id;
    const editEvent = req.body;
    console.log(token);
    try {
      const verification = jwt.verify(token, "mysecret"); // verification token
      if (verification.admin) {
        //if you're admin you can edit the event.

        //here ,I get the event by the id and update it.
        await eventModel.findOneAndUpdate(
          { _id: idEvent },
          {
            admin: editEvent.admin,
            name: editEvent.name,
            ...(req.file && { filename: req.file.filename }),
            date: editEvent.date,
            place: editEvent.place,
            time: editEvent.time,
            description: editEvent.description
          }
        );

        const event = await eventModel.findById(idEvent);
        // the idEvent will never be enclosed in braces here,
        //so it does not return an object.

        res.send(event);
      } else {
        res
          .status(403)
          .send("Sorry you are not an admin, you can't edit event");
      }
    } catch (error) {
      res
        .status(401)
        .send("Sorry you don't have permission to edit event" + error);
    }
  }
);

//here, we're going to delete an event and only the admin will be able to do it.

router.delete("/:id", (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const idEvent = req.params.id;
  try {
    let verification = jwt.verify(token, "mysecret");
    if (verification.admin) {
      eventModel.findOneAndDelete({ _id: idEvent }, (err, result) => {
        if (err) throw err;
        res.send("delete event");
      });
    } else {
      res.send("Sorry, you don't have permission to delete event.");
    }
  } catch (err) {
    res
      .status(401)
      .send("Sorry, you don't have permission your Token is not valid");
  }
});

module.exports = router;
