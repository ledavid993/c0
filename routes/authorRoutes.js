const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = mongoose.model("users");
const requireLogin = require("../middlewares/requireLogin");

const Novel = mongoose.model("novels");
const Chapter = mongoose.model("chapters");
module.exports = app => {
    app.get("/api/author", async (req, res) => {
        try {
            let user = await User.find();
            res.send(user);
        } catch (err) {}
    });
    app.get("/api/author/:id", async (req, res) => {
        try {
            let user = await User.findOne({ googleID: req.params.id });
            let novels = await Novel.find({ _user: user._id }).sort({
                dateUpdated: -1
            });
            res.send(novels);
        } catch (err) {
            res.status(401).send(err);
        }
    });

    app.post("/api/author/:id/create", requireLogin, async (req, res) => {
        const { title, synopsis, image } = req.body;

        const novel = new Novel({
            title,
            synopsis,
            image,
            authorName: req.user.authorName,
            _user: req.user.id,
            dateCreated: Date.now(),
            dateUpdated: Date.now()
        });

        try {
            await novel.save();
            res.send(req.user);
        } catch (err) {
            res.status(422).send(err);
        }
    });

    app.get("/api/author/novel/:novelId", async (req, res) => {
        try {
            let novel = await Novel.findOne({ _id: req.params.novelId });
            let chapters = await Chapter.find({ _novel: novel }).sort({
                date: -1
            });
            novel = {
                ...novel._doc
            };
            novel["chapters"] = chapters;
            res.send({
                novel
            });
        } catch (err) {}
    });

    app.post("/api/author/novel/:novelId/add", requireLogin, async (req, res) => {
        const { title, passage } = req.body;
        try {
            const chapters = await Chapter.find({ _novel: req.params.novelId });

            const chapter = new Chapter({
                No: chapters.length + 1,
                title,
                passage,
                _novel: req.params.novelId,
                date: Date.now()
            });

            await Novel.updateOne(
                { _id: req.params.novelId },
                {
                    $set: {
                        dateUpdated: Date.now()
                    }
                }
            );

            await chapter.save();
            res.send(chapter);
        } catch (err) {}
    });
};
