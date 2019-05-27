const mongoose = require("mongoose");
const { Schema } = mongoose;

const Chapter = mongoose.model("Chapter", {
    no: { type: Number, default: 0 },
    title: {
        type: String,
        required: true
    },
    passage: {
        type: String,
        required: true
    },
    dateCreated: Date,
    likes: { type: Number, default: 0 },
    novel: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Novel"
    }
});

module.exports = Chapter;
