const express = require("express");
const keys = require("./config/keys");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

require("./models/Novel");
require("./models/Chapter");

mongoose.connect(keys.mongoURI);
const app = express();

app.use(bodyParser.json());

app.use(cors());

require("./routes/authRoutes")(app);
require("./routes/profileRoutes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT);
