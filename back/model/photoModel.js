const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "userModel" },
    filename: String,
    name: { type: String},
    camera: String,
    dateAdded: {type: Date, default: Date.now},
    localization: { type: String, required: true }
  },
  { collection: "photos" }
);

module.exports = mongoose.model("photoModel", photoSchema);
//despues para llamar en el front al id del album lo llamare con photoModel. lo que sea
