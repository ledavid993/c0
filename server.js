const express = require("express");
const keys = require("./config/keys");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("./models/Novel");
require("./models/Chapter");

mongoose.connect(keys.mongoURI);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Controll-Allow-Methods", "PUT, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

require("./routes/authRoutes")(app);
require("./routes/profileRoutes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT);
