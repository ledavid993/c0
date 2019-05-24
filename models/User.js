const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    googleID: String,
    isAuthor: { type: Number, default: 0 },
    authorName: { type: String, default: "Anonymous" },
    degree: String,
});

mongoose.model("users", userSchema);
