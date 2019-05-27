const auth = require("../middlewares/auth");
const Novel = require("../models/Novel");
const Chapter = require("../models/Chapter")

module.exports = app => {
    app.get("/profile", auth, async (req, res) => {
        res.send(req.user);
    });

    app.post("/profile/novels", auth, async (req, res) => {
        const novel = new Novel({
            ...req.body,
            author: req.user._id
        })

        try{
            await novel.save();
            res.status(201).send(novel);
        }catch(err){
            res.status(400).send(err)
        }
    })

    app.get("/profile/novels", auth, async (req, res) => {
        try {
            await req.user.populate("novels").execPopulate();
            res.send(req.user.novels);
        } catch (err) {
            res.status(500).send();
        }
    });

    app.get('/profile/novels/:id', auth, async (req, res) => {
        try{
            const novel = await Novel.findById(req.params.id)
            await novel.populate("chapters").execPopulate();
            res.send(
                {
                    novel:{
                        ...novel._doc,
                        chapters: novel.chapters
                    }
                }
            )
        }catch(err){

        }
    })

    app.post('/profile/novels/:id', auth, async (req,res) => {

        const novel = await Novel.findById(req.params.id)
        await novel.populate("chapters").execPopulate();

        const chapterNo = novel.chapters.length + 1

        const chapter = new Chapter({
            ...req.body,
            novel: req.params.id,
            no: chapterNo
        })

        try{
            await chapter.save()
            res.status(201).send(chapter)
        }catch(err){
            res.status(400).send(err)
        }
    })
};
