const express = require("express");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("./models/User");
require("./models/Novel");
require("./models/Chapter")
require("./services/passport");

mongoose.connect(keys.mongoURI);
const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/authorRoutes")(app);
require("./routes/novelRoutes")(app);

app.listen(8080, () => {
    console.log("app is running on port 8080");
});
