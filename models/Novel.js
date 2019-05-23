const mongoose = require("mongoose");
const { Schema } = mongoose;

const novelSchema = new Schema({
    title: String,
    synopsis: String,
    imageURL: String,
    _user: { type: Schema.Types.ObjectId, ref: "User"},
    dateCreated: Date,
    dateUpdated: Date,
});

mongoose.model("novels", novelSchema)
