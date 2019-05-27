const mongoose = require("mongoose");
const { Schema } = mongoose;

const novelSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    synopsis: {
        type: String,
        required: true
    },
    image: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    dateCreated: Date,
    dateUpdated: Date,
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        red: "User"
    }
});

novelSchema.virtual("chapters", {
    ref: "Chapter",
    localField: "_id",
    foreignField: "novel"
});

const Novel = mongoose.model("Novel", novelSchema);

module.exports = Novel;
