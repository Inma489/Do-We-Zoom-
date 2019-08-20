var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const userModel = require("../model/userModel");
const photoModel = require("../model/photoModel");
const multer = require("multer");

// LISTAR TODOS LOS USUARIOS
// listar usuarios, para ello utilizaremos router.get
// PRIMERO LISTAREMOS LOS USUARIOS EN FUNCION DE SI SON ADMINISTRADORES O NO
router.get("/", async (req, res) => {
  // req.headers.authorization // nos devuelve el token
  console.log(req.headers.authorization); // aqui comprobamos que el token que estamos enviando con postman es correcto o no
  const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
  console.log(token);
  try {
    const verification = jwt.verify(token, "mysecret"); // aqui entra tanto si es administrador como si no
    console.log(verification);
    // si no esta no esta verificado y no es administrador// este admin viene de la base de datos
    // res.status(401).send('You are not an admin');// mee dice que si no es un administrador me muestre el estado de que no lo es
    if (!verification.admin) {
      // si no eres admin muestrame esto:
      //con el async y con el await ya no tengo que poner el .then
      const users = await userModel.find(
        {},
        { _id: 1, username: 1, email: 1, avatar: 1 }
      );
      // el 1 es para que me muestre las cosas y el 0 es cuando no quiero que me las muestre
      res.send(users);
    } else {
      // si eres admin muestrame esto:
      const users = await userModel.find(
        {},
        { _id: 1, username: 1, email: 1, avatar: 1 }
      );
      res.send(users);
    }
  } catch (err) {
    // si no es ni administrador ni esta verirficado mandame un error en el que me diga que no tienes permiso para acceder
    console.log(err);
    res.status(401).send("You don't have permission");
  }
});

//MOSTRAR UN USUARIO POR EL ID
router.get("/:id", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
  try {
    const verification = jwt.verify(token, "mysecret"); // verificacion token
    console.log(token);
    console.log(verification);
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    res.send(user); // me imprime ese usuario correctamente
  } catch (e) {
    res.status(401).send("You don't have permission " + e);
  }
});

// MOSTRAR PHOTOS POR EL ID DE USUARIO, ME MUESTRA LAS PHOTOS QUE TIENE EL USUARIO

router.get("/:id/photos", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
  try {
    jwt.verify(token, "mysecret"); // verificacion token
    const id = req.params.id;
    const photo = await userModel.find({ owner: id });
    res.send(photo); // me imprime esa photo correctamente
  } catch (e) {
    res.status(401).send("You don't have permission to show this photo " + e);
  }
});

//VAMOS A AÑADIR UNA PHOTO POR EL ID DEL USUARIO, CREAR UNA EN EL PERFIL DEL USUARIO //PREGUNTAR A ANGEL SI ESTA BIEN

router.post("/add/:id/photos", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
  const newAlbum = req.body;
  console.log(newAlbum);
  try {
    const verification = jwt.verify(token, "mysecret"); // verificacion token

    if (!verification.admin) {
      const photo = await new photoModel({
        //aqui nos crea una photo nueva
        name: newPhoto.name,
        camera: newPhoto.camera,
        imageUrl: newPhoto.imageUrl,
        localization: newPhoto.localization,
        owner: newPhoto.owner //  poner el user en postman y meter el id a mano luego en el front sera distinto// PREGUNTAR A ANGEL SI ESTA BIEN
      });
      photo.save((error, result) => {
        //aqui manejo errores, si me da un error muestramelos
        if (error) {
          if (error.code === 11000) {
            console.log(error);
            res.send("this photo already exist.");
          } else {
            res.send("error " + error.errmsg[0]);
          }
        }
        console.log(result);
        res.send(result);
      });
    } else {
      res.send("You're not an user, you can't add a photo");
    }
  } catch (err) {
    res
      .status(401)
      .send("Sorry, you don't have permission to add photos" + err);
  }
});

////AQUI PUEDO METER LA PETICION DE MANDAR COSAS DE LAS FOTOS U ARCHIVOS
var avatarStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file !== "") {
      cb(null, "public/uploads/avatars/");
    } else {
      console.log("No existe file para crear el avatar");
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
      console.log("el archivo file esta vacio o no existe");
    }
  }
  //   cb(null, Date.now() + "." + file.originalname.split(".").slice(-1));
});

//AHORA VAMOS A CREAR UN USUARIO

router.post(
  "/add",
  multer({ storage: avatarStorage }).single("file"),
  async (req, res) => {
    const newUser = req.body;
    console.log(newUser);
    try {
      // if (verification.admin) {
      const user = await new userModel({
        //aqui nos crea un usuario nuevo
        username: newUser.username,
        email: newUser.email,
        ...(req.file &&
          req.file.filename != "" && { avatar: req.file.filename }),
        ...(!req.file && { avatar: "" }),
        password: md5(newUser.password)
      });
      user.save((error, result) => {
        //aqui manejo errores, si me da un error muestramelos
        if (error) {
          if (error.code === 11000) {
            console.log(error);
            //el username ya existe con este error
            res.status(400).send({e: error});
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

// ahora creamos la funcion de poder editar un usuario, si eres administrador podras editar el usuario y si eres usuario y coincide con
//el id que me lo pueda editar

router.put(
  "/:id",
  multer({ storage: avatarStorage }).single("file"),
  async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
    const idUser = req.params.id;
    const editUser = req.body;
    console.log(token);
    try {
      const verification = jwt.verify(token, "mysecret"); // verificacion token
      if (verification.admin || verification._id == idUser) {
        // si eres administrador o id conincide con el usuario podrá editar
        // console.log(idUser);
        //aqui me ecuntra el usuario por el id y me lo actualiza
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

        const user = await userModel.findById(idUser, { password: 0 }); // el idUser nunca irá entre llaves aqui porq no devuelve un objeto
        // console.log(user);
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

// QUEREMOS EDITAR UNA PHOTO POR EL ID DEL USUARIO // PREGUNTAR A ANGEL TAMBIEN SI ESTA BIEN

router.put("/:id/photos", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", ""); // esto es para que nos quite del console el Bearer que nos aparece al lado del token
  const idPhoto = req.params.id;
  const editPhoto = req.body;
  console.log(token);
  try {
    const verification = jwt.verify(token, "mysecret"); // verificacion token
    if (!verification.admin) {
      // si eres usuario podrás editar tu photo

      //aqui me ecuntra el usuario por el id y me lo actualiza
      await photoModel.findOneAndUpdate(
        { _id: idPhoto },
        {
          name: editPhoto.name,
          imageUrl: editPhoto.imageUrl,
          camera: editPhoto.camera,
          localization: editPhoto.localization,
          owner: verification._id
        }
      );
      //PREGUNTAR A ANGEL SI LO QUE HICE ESTA BIEN
      const photo = await photoModel.findById(owner); // el idPhoto nunca irá entre llaves aqui porq no devuelve un objeto//
      // no se si esta bien aqui puesto el owner// PREGUNTAR A ANGEL

      res.send(photo);
    } else {
      res.status(403).send("Sorry you are not an user, you can't edit album");
    }
  } catch (error) {
    res
      .status(401)
      .send("Sorry you don't have permission to edit album" + error);
  }
});

// ahora voy a eliminar una photo tanto el admin como el usuario podran borrar photos
// EL USUARIO PUEDA BORRAR UNA PHOTO, A TRAVES DE SU ID
// PREGUNTAR A ANGEL SI ESTA BIEN O NO

// router.delete("/:id/photos", (req, res) => {
//   const idPhoto = req.params.id;
//   try {
//     const token = req.headers.authorization.replace("Bearer ", "");
//     let verification = jwt.verify(token, "mysecret");
//     if (verification.admin || verification._id) {
//       photoModel.deleteOne({ _id: idPhoto }, (err, result) => {
//         if (err) throw err;
//         res.send("delete photo");
//       });
//     } else {
//       res.send("Sorry, you don't have permission to delete photo.");
//     }
//   } catch (err) {
//     res
//       .status(401)
//       .send("Sorry, you don't have permission your Token is not valid");
//   }
// });

// aqui quiero borrar el usuario y todas las fotos que tenga, borrar cuenta

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
