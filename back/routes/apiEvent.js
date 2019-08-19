var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const multer = require("multer");
const eventModel = require("../model/eventModel");
//LISTAR TODOS LOS EVENTOS LOS CUALES EL DAMINSITRADOR PODRA VERLOS Y EL USUARIO TAMBIEN
// SOLO VERLOS LOS USUARIOS Y CREAR,ELIMINAR Y MODIFICAR LO HARA EL ADMINISTRADOR

router.get("/", async (req, res) => {
  console.log(req.headers.authorization);
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const verification = jwt.verify(token, "mysecret"); // aqui entra tanto si es administrador como si no
    //si eres administrador podras ver todo lo que le ponga, si no..el usuario
    //solo podra ver las cosas
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
      // si no eres admin, es decir si eres un usuario muestrame esto
      const event = await eventModel.find(
        {},
        {
          _id: 0
        }
      );
      res.send(event);
    }
  } catch (error) {
    // si no es ni administrador ni esta verirficado mandame un error en el que me diga que no tienes permiso para acceder
    console.log(error);
    res.status(401).send("You don't have permission to get events");
  }
});

//MOSTRAR UN EVENTO POR EL ID
router.get("/:id", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
  try {
    const verification = jwt.verify(token, "mysecret"); // verificacion token
    // console.log(token);
    console.log(verification);
    const eventId = req.params.id;
    // aqui es donde no me muestra el evento si le pongo un find()
    //lo que tenia puesto es findbyid
    //PREGUNTAR A ANGEL
    // PREGUNTAR A ANGELLLL IMPORTANTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE!!!!!!!!!
    const event = await eventModel.findById(eventId);
    res.send(event); // me imprime esa evento correctamente
  } catch (err) {
    res.status(401).send("You don't have permission to show this event " + err);
  }
});

// las fotos que suban los usuarios si las voy a gaurdar en la base de datos con
//el filename

var eventStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/events/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "." + file.originalname.split(".").slice(-1));
  }
});

//AHORA VAMOS A CREAR UN EVENTO

router.post(
  "/add",
  multer({ storage: eventStorage }).single("file"),
  async (req, res) => {
    //ME VA HACER FALTA EL TOKEN PARA CREAR eventod PARA EL admin , PARA EL usuario NO PUEDE CREAR eventos
    const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
    const newEvent = req.body;
    console.log(newEvent);
    try {
      const verification = jwt.verify(token, "mysecret"); // verificacion token

      if (verification.admin) {
        const event = await new eventModel({
          //aqui nos crea un album nuevo
          ...(newEvent.name != null && {name : newEvent.name}),
          ...(req.file &&
            req.file.filename != "" && { filename: req.file.filename }),
          ...(!req.file && { filename: "" }),
          admin: verification._id,
          ...(newEvent.date != null && {date: newEvent.date}),
          ...(newEvent.place != null && {place: newEvent.place}),
          ...(newEvent.time != null && {time: newEvent.time}),
          ...(newEvent.description != null && {description: newEvent.description})
        });
        event.save((error, result) => {
          //aqui manejo errores, si me da un error muestramelos
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

// ahora creamos la funcion de poder editar un event, si eres usuario no podras editar el evento y si eres admin si
// con foto

router.put(
  "/:id",
  multer({ storage: eventStorage }).single("file"),
  async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
    const idEvent = req.params.id;
    const editEvent = req.body;
    console.log(token);
    try {
      const verification = jwt.verify(token, "mysecret"); // verificacion token
      if (verification.admin) {
        // si eres admin podrás editar tu evento

        //aqui me ecuntra el evento por el id y me lo actualiza
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

        const event = await eventModel.findById(idEvent); // el idEvent nunca irá entre llaves aqui porq no devuelve un objeto

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

// // ahora voy a eliminar un evento y solo el admin podrá borrar los eventos

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
