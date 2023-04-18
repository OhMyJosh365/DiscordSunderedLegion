const { Schema, model } = require("mongoose");

const encounterSchema = new Schema({
    _id: Schema.Types.ObjectId,
    area: String,
    enemies: Array
});

module.exports = model("Encounters", encounterSchema, "encounters");