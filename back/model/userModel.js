const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//here, we define the user scheme we want.
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    avatar: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    admin: Boolean
  },
  { collection: "users" }
);

module.exports = mongoose.model("userModel", userSchema);
