var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const photoModel = require("../model/photoModel");
const userModel = require("../model/userModel");
const multer = require("multer");

//VAMOS A OBTENER LISTADO DE FOTOS
//Tanto el admin podra listar fotos como el usuario podra ver listado de sus fotos

router.get("/", async (req, res) => {
  // req.headers.authorization // nos devuelve el token
  console.log(req.headers.authorization); // aqui comprobamos que el token que estamos enviando con postman es correcto o no

  // console.log(token);
  try {
    const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
    let verification = jwt.verify(token, "mysecret"); // aqui entra tanto si es administrador como si no
    // console.log(verification);
    // si no esta no esta verificado y no es administrador// este admin viene de la base de datos
    // res.status(401).send('You are not an admin');// mee dice que si no es un administrador me muestre el estado de que no lo es
    if (!verification.admin) {
      // si no eres admin muestrame esto:
      //con el async y con el await ya no tengo que poner el .then

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
      // el 1 es para que me muestre las cosas y el 0 es cuando no quiero que me las muestre
      res.send(photo);
    } else {
      // si eres admin muestrame esto:
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
    // si no es ni administrador ni esta verirficado mandame un error en el que me diga que no tienes permiso para acceder
    console.log(err);
    res.status(401).send("You don't have permission to get photos");
  }
});

//PREGUNTAR A ANGELLLLL SUPER IMPORTANTEEEEEEEEEE

//MOSTRAR UNA PHOTO POR EL ID
// router.get("/:id", async (req, res) => {

//   try {
//     const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
//     const verification = jwt.verify(token, "mysecret"); // verificacion token

//     // console.log(token);
//     console.log(verification);
//     const userId = req.params.id;
//     console.log(userId);
//     console.log(typeof(userId));

//     // aqui es donde no me muestra la foto si le pongo un find()
//     //lo que tenia puesto es findbyid
//     //no me meuistra la foto del id del usuario
//     //PREGUNTAR A ANGEL
//     //cuando cambio photoModel por userModel que es como debería ser me trae el array vacio de fotos
//     // PREGUNTAR A ANGELLLL IMPORTANTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE!!!!!!!!!
//     const photo = await photoModel.findById({userId});
//     console.log(photo);
//     res.send(photo); // me imprime esa photo correctamente
//   } catch (e) {
//     res.status(401).send("You don't have permission to show this photo " + e);
//   }
// });

// las fotos que suban los usuarios si las voy a gaurdar en la base de datos con
//el filename

var photosStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/photos/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "." + file.originalname.split(".").slice(-1));
  }
});

//AHORA VAMOS A CREAR UNA FOTO con MULTERRRRR

router.post(
  "/add",
  multer({ storage: photosStorage }).single("file"),
  async (req, res) => {
    //ME VA HACER FALTA EL TOKEN PARA CREAR FOTOS PARA EL ALBUM, PARA EL ADMIN NO PUEDE CREAR FOTOS// EL USUARIO SI
    const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
    const newPhoto = req.body;
    console.log("newPhoto");

    try {
      let verification = jwt.verify(token, "mysecret"); // verificacion token
      console.log(verification);

      if (!verification.admin) {
        const photo = await new photoModel({
          //aqui nos crea una photo nueva
          ...(newPhoto.name != null && { name: newPhoto.name }),
          camera: newPhoto.camera,
          ...(req.file &&
            req.file.filename != "" && { filename: req.file.filename }),
          ...(!req.file && { filename: "" }),
          ...(newPhoto.localization != null && {
            localization: newPhoto.localization
          }),
          owner: verification._id //  poner el owner en postman y meter el id a mano luego en el front sera distinto
        });
        console.log(photo);
        photo.save((error, result) => {
          //aqui manejo errores, si me da un error muestramelos
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

//AHORA VOY A EDITAR UNA PHOTO SOLAMENTE SI ERES USUARIOS PODRAS EDITAR SI ERES ADMIN NO

router.put(
  "/:id",
  multer({ storage: photosStorage }).single("file"),
  async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const idPhoto = req.params.id;
    const editPhoto = req.body;
    console.log(token);
    try {
      let verification = jwt.verify(token, "mysecret"); // verificacion token
      if (!verification.admin) {
        // si eres usuario podras editar
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

//AHORA HAREMOS ELIMINAR UNA FOTO, EL ADMIN PODRA ELIMINARLA Y EL USER TAMBIEN

router.delete("/:id", (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const idPhoto = req.params.id;
  try {
    //meto la verificacion de si estas logueado y me da el token

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
