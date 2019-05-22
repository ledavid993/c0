const passport = require("passport");

module.exports = app => {
    app.get(
        "/auth/google",
        passport.authenticate("google", {
            scope: ["profile", "email"]
        })
    );

    app.get(
        "/auth/google/callback",
        passport.authenticate("google"),
        (req, res) => {
            res.redirect("/surveys");
        }
    );

    app.get(
        "/api/curr_user",
        (req, res) => {
            res.send(req.user)
        }
    )
};
