const { Schema, model } = require("mongoose");

const townInfoSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    region: String,
    townSlots: Array,
    resource: String,
    characterUnlock: String,
    lvlMin: Number
});

module.exports = model("TownInfo", townInfoSchema, "towninfo");