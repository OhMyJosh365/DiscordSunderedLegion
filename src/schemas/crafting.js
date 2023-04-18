const { Schema, model } = require("mongoose");

const craftingSchema = new Schema({
    _id: Schema.Types.ObjectId,
    fishingRecipes: Array
});

module.exports = model("Crafting", craftingSchema, "craftings");