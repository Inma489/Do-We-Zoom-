var express = require("express");
var router = express.Router();

//requerirlas (sólo las rutas de back)

const apiAuthRouter = require("./apiAuth");
const apiUserRouter = require("./apiUser");
const apiPhotoRouter = require("./apiPhoto");
const apiEventRouter = require("./apiEvent");;

//llamarlas
// (/users) es la segunda parte de la url

router.use("/users", apiUserRouter); // usamos los router que hemos creado en las diferentes rutas
//en este caso es router.use("/users");
router.use("/auth", apiAuthRouter);
//aqui requiero a lo que voy a utilizar que es la ruta photos
router.use("/photos", apiPhotoRouter);
//aqui requiero la apievent para usarla
router.use("/events", apiEventRouter);

//exportar
//aqui van todas las rutas de tu carpeta routes
//ej: apiUsers,apiAuth, etc
//esta api.js va a app.js

module.exports = router;
