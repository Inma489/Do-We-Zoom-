const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "userModel" },
    filename: String,
    name: { type: String, required:true },
    camera: String,
    dateAdded: {type: Date, default: Date.now},
    //poner fecha de la foto en la que se subio(dateAdded=  type: date,date.now)
    // poner fecha actulizada por si el usuario la quiere editar
    //updated: { type: Date, default: Date.now },
    localization: { type: String, required: true }
  },
  { collection: "photos" }
);

module.exports = mongoose.model("photoModel", photoSchema);
//despues para llamar en el front al id del album lo llamare con photoModel. lo que sea
