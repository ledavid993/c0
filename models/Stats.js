const mongoose = require("mongoose");
const { Schema } = mongoose;

const statSchema = new Schema({
    view: {
        type: Number,
        default: 0
    }
});

const Stat = mongoose("Stat", statSchema)

module.exports = Stat;
