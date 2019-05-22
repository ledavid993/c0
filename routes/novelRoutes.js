const mongoose = require("mongoose");
const Novel = mongoose.model("novels");

const Chapter = mongoose.model("chapters");

module.exports = app => {
    app.get("/novels", async (req, res) => {
        let novelList = [];
        let novel = await Novel.find().sort({"dateUpdated": -1}).limit(15)

        let promise = novel.map(
            novel =>
                new Promise((resolve, reject) => {
                    Chapter.find({ _novel: novel }).sort({"date": -1}).limit(3).then(chapters => {
                        let newNovel = {
                            ...novel._doc
                        };
                        newNovel["chapters"] = chapters;
                        novelList.push({
                            novel: newNovel
                        });
                        resolve();
                    });
                })
        );

        Promise.all(promise).then(() => {
            res.send(novelList);
        });
    });

    app.get("/novels/:title", async (req, res) => {
        try {
            let novelTitleURI = decodeURIComponent(req.params.title);
            let novel = await Novel.findOne({ title: novelTitleURI });
            let chapters = await Chapter.find({ _novel: novel }).sort({"date": -1});
            if (chapters) {
                res.send({
                    novel,
                    chapters
                });
            }
        } catch (err) {
            res.status(401).send(err);
        }
    });
};
