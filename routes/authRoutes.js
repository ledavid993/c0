const User = require("../models/User");
const auth = require("../middlewares/auth")

module.exports = app => {
    app.post("/register", async (req, res) => {
        const user = new User(req.body);

        try {
            await user.save();
            const token = await user.generateAuthToken();
            res.status(201).send({ user, token });
        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.post("/login", async (req, res) => {
        try {
            const user = await User.findByCredentials(
                req.body.username,
                req.body.password
            );
            const token = await user.generateAuthToken();
            res.send({user, token})
        } catch (e) {
            res.status(400).send();
        }
    });

    app.post("/logout", auth, async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter(tokens => {
                return tokens.token !== req.token;
            });
            await req.user.save()
            res.send()
        } catch (err) {
            res.status(500).send();
        }
    });
};
