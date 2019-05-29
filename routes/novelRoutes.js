const mongoose = require("mongoose");
const Novel = require("../models/Novel");
const Chapter = require("../models/Chapter")
module.exports = app => {
    app.get("/api/novels", async (req, res) => {
        let novel = await Novel.find()
            .sort({ dateUpdated: -1 })
            .limit(50);

        let novelListPromise = novel.map(async novel => {
            try {
                await novel
                    .populate("chapters", null, null, {
                        limit: 2,
                        sort: { dateCreated: -1 }
                    })
                    .execPopulate();

                if (novel.chapters.length !== 0) {
                    return {
                        ...novel._doc,
                        chapters: novel.chapters
                    };
                } else {
                }
            } catch (err) {}
        });

        Promise.all(novelListPromise).then(novelList => {
            res.send(novelList.filter(Boolean));
        });
    });

    app.get("/api/novels/:title/:no", async (req, res) => {
        try {
            
            title = decodeURIComponent(req.params.title);
            const novel = await Novel.findOne({ title: title });
            const chapter = await Chapter.findOne({ novel: novel, no: req.params.no });
            
            res.send(chapter);
        } catch (err) {
            res.status(404).send(err);
        }
    });
};
