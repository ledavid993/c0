const mongoose = require("mongoose");
const Novel = require("../models/Novel");

module.exports = app => {
    app.get("/api/novels", async (req, res) => {
        let novel = await Novel.find()
            .sort({ dateUpdated: -1 })
            .limit(50);

        let novelListPromise = novel.map(async novel => {
            await novel
                .populate("chapters", null, null, {
                    limit: 2,
                    sort: { dateCreated: -1 }
                })
                .execPopulate();

            return {
                ...novel._doc,
                chapters: novel.chapters
            };
        });

        Promise.all(novelListPromise).then(novelList => {
            res.send(novelList);
        });
    });
};
