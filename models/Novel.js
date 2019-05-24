const mongoose = require("mongoose");
const { Schema } = mongoose;

const novelSchema = new Schema({
    title: String,
    synopsis: String,
    image: String,
    authorName: String,
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    _user: { type: Schema.Types.ObjectId, ref: "User"},
    dateCreated: Date,
    dateUpdated: Date,
});

mongoose.model("novels", novelSchema)
