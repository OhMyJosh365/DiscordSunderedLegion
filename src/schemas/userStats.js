const { Schema, model } = require("mongoose");

const userStatsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    user: Array,
    army: Array,
    inventory: Array,
    battleState: Array
});

module.exports = model("UserStats", userStatsSchema, "userstats");