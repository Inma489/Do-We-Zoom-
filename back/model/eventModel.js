const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: "userModel" },
    name: { type: String, required: true, unique: true },
    filename: String,
    date: { type: String, required: true },
    place: { type: String, required: true },
    time: { type: String, required: true },
    description: String
  },
  { collection: "events" }
);

module.exports = mongoose.model("eventModel", eventSchema);
