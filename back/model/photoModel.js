const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// here, we create photo model.
const photoSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "userModel" },
    filename: String,
    name: { type: String },
    camera: String,
    dateAdded: { type: Date, default: Date.now },
    localization: { type: String }
  },
  { collection: "photos" }
);

module.exports = mongoose.model("photoModel", photoSchema);
