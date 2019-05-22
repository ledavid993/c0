const mongoose = require("mongoose");
const { Schema } = mongoose;

const chapterSchema = new Schema({
    No: { type: Number, default: 0},
    title: String,
    passage: String,
    date: Date,
    likes: { type: Number, default: 0 },
    _novel: { type: Schema.Types.ObjectId, ref: "Novel" }
});

mongoose.model( "chapters", chapterSchema);
