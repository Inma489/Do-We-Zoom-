const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// here, we create event model
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
  { collection: "events" } // our collection from Robot3T.
);

module.exports = mongoose.model("eventModel", eventSchema);
