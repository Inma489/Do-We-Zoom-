var express = require("express");
var router = express.Router();

//require them (back paths only).

const apiAuthRouter = require("./apiAuth");
const apiUserRouter = require("./apiUser");
const apiPhotoRouter = require("./apiPhoto");
const apiEventRouter = require("./apiEvent");

//here, we call the routes.

// (/users) it's the second part of the url.
//we use router.use so we can call apiUser.
router.use("/users", apiUserRouter); // we use the routers we've created on different routes.
// we use router.use so we can call apiAuth.
router.use("/auth", apiAuthRouter);
//we use router.use so we can call apiphotos.
router.use("/photos", apiPhotoRouter);
//we use router.use so we can call apievent.
router.use("/events", apiEventRouter);

//exportar router
module.exports = router;
