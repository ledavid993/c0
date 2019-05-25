const mongoose = require("mongoose");

const Novel = mongoose.model("novels");
const Chapter = mongoose.model("chapters");

module.exports = app => {
    app.get("/api/novels", async (req, res) => {
        let novel = await Novel.find()
            .sort({ dateUpdated: -1 })
            .limit(15);

        let novelPromises = novel.map(async novel => {
            let chapters = await Chapter.find({ _novel: novel })
                .sort({ date: -1 })
                .limit(2);

            let oldNovelState = {
                ...novel._doc
            };

            oldNovelState["chapters"] = chapters;
            novel = oldNovelState;

            return novel;
        });

        await Promise.all(novelPromises).then(novelList => {
            res.send(novelList);
        });
    });

    app.get("/api/novels/:title", async (req, res) => {
        try {
            let novelTitleURI = decodeURIComponent(req.params.title);
            let novel = await Novel.findOne({ title: novelTitleURI });
            let chapters = await Chapter.find({ _novel: novel }).sort({
                date: -1
            });
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

    app.get("/api/novels/:title/:chapterNo", async (req,res) => {
        try{
            let novelTitleURI = decodeURIComponent(req.params.title);
            let novel = await Novel.findOne({ title: novelTitleURI });
            if(novel){
                let chapter = await Chapter.findOne({_novel: novel, No: req.params.chapterNo})
                if(chapter){
                    res.send(chapter)
                }
            }
        }catch(err){}
    })
};
