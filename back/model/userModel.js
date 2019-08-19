const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//aqui definimos el esquema de usuario que queremos
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    avatar: String,
    //usernamne sea de tipo string, que me pida por obligacion el username
    // y que ese usuario sea unico
    email: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true, select: false },
    admin: Boolean
  },
  { collection: "users" } // nos creara la coleccione en la basae de datos de mongo
);

module.exports = mongoose.model("userModel", userSchema);
