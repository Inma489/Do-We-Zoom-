const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const mongoConnection = mongoose
  .connect("mongodb://localhost/dowezoom", { useNewUrlParser: true })
  .then(_ok => console.log("Connected to Mongo!"))
  .catch(err => console.error("Somewhing went wrong", err));

module.exports = mongoConnection;
