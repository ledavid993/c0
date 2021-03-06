const auth = require("../middlewares/auth");
const Novel = require("../models/Novel");
const Chapter = require("../models/Chapter");

module.exports = app => {
    app.get("/profile", auth, async (req, res) => {
        res.send(req.user);
    });

    app.post("/profile/novels", auth, async (req, res) => {
        const novel = new Novel({
            ...req.body,
            authorName: req.user.username,
            author: req.user._id,
            dateCreated: Date.now(),
            dateUpdated: Date.now()
        });

        try {
            await novel.save();
            res.status(201).send(novel);
        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.get("/profile/novels", auth, async (req, res) => {
        try {
            await req.user.populate("novels").execPopulate();
            res.send(req.user.novels);
        } catch (err) {
            res.status(500).send();
        }
    });

    app.get("/profile/novels/:id", auth, async (req, res) => {
        try {
            const novel = await Novel.findById(req.params.id);

            await novel.populate("chapters").execPopulate();
            res.send(novel.chapters);
        } catch (err) {}
    });

    app.post("/profile/novels/:id", auth, async (req, res) => {
        try {
            const novel = await Novel.findByIdAndUpdate(req.params.id, {
                dateUpdated: Date.now()
            });

            await novel.populate("chapters").execPopulate();

            const chapterNo = novel.chapters.length + 1;

            const chapter = new Chapter({
                ...req.body,
                novel: req.params.id,
                no: chapterNo,
                dateCreated: Date.now()
            });

            await chapter.save();
            res.status(201).send(chapter);
        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.patch("/profile/novels/:id/:no"),
        auth,
        async (req, res) => {
            try {
                const novel = await Novel.findById(req.params.id);

                await Chapter.findOneAndUpdate(
                    { novel: novel, no: req.params.no },
                    {
                        passage: req.body.passage
                    }
                );

                res.status(200).send();
            } catch (err) {
                res.status(400).send(err);
            }
        };
};
