const itemModel = require("../models/item.model");
const isAuth = require("../middlewares/auth.middleware");
const tagModel = require("../models/tag.model");
const collectionModel = require("../models/collection.model");
const { Router } = require("express")
const textSearch = require('fuzzy-search');

const router = Router()

router.post(
    "/getItem",
    async (req, res) => {
        try {

            const item = await itemModel.findOne({ _id: req.body.id })
            if(!item) {
                return res.status(400).json({ message: "Итем не найден" })
            }

            res.status(200).json({ message: "Итем найден", item, ok: true })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так", error: e.message })
        }
    }
)

router.post(
    "/editItem",
    isAuth,
    async (req, res) => {
        try {
            if (req.user.role !== "Admin" && req.user._id.toString() !== req.body.ownerId) {
                return res.status(400).json({ message: "У вас недостаточно прав" })
            }

            const item = await itemModel.findOne({ _id: req.body.id })

            if(!item) {
                return res.status(400).json({ message: "Итем не найден" })
            }

            if (req.body.edit.name) item.name = req.body.edit.name
            if (req.body.edit.img_id) {
                item.img_id = req.body.edit.img_id
                item.img_format = req.body.edit.img_format
            }

            await item.save()

            res.status(200).json({ message: "Редактирование прошло успешно", item, ok: true })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так", error: e.message })
        }
    }
)

router.get("/getTags", async(req, res) => {
    try {
        const tags = await tagModel.find({})

        res.status(200).json({ tags, ok: true })
    } catch(e) {
        res.status(500).json({ message: "Что-то пошло не так", error: e.message })
    }
})

router.post(
    "/editItemFields",
    isAuth,
    async (req, res) => {
        try {
            if (req.user.role !== "Admin" && req.user._id.toString() !== req.body.ownerId) {
                return res.status(400).json({ message: "У вас недостаточно прав" })
            }

            const item = await itemModel.findOne({ _id: req.body.id })

            if(!item) {
                return res.status(400).json({ message: "Итем не найден" })
            }

            item.fields = req.body.edit

            await item.save()

            res.status(200).json({ message: "Редактирование прошло успешно", item, ok: true })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так", error: e.message })
        }
    }
)

router.post(
    "/createComment",
    isAuth,
    async (req, res) => {
        try {
            const item = await itemModel.findOne({ _id: req.body.itemId })

            if(!item) {
                return res.status(400).json({ message: "Итем не найден" })
            }

            item.comments = [...item.comments, {
                username: req.user.username,
                message: req.body.message,
                userId: req.user._id
            }]

            await item.save()

            res.status(201).json({ message: "Комментарий создан", ok: true })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так", error: e.message })
        }
    }
)

router.post(
    "/findItems",
    async (req, res) => {
        try {
            const items = await itemModel.find({})

            const values = req.body.text.split(" ")
            const tags = req.body.tags
            let result = []

            for (let i = 0; i < items.length; i++) {
                let itemTags = []
                let priority = 0
                for (let j = 0; j < items[i].tags.length; j++) {
                    let tag = await tagModel.findOne({ _id: items[i].tags[j] })
                    if (tag) itemTags.push(tag)
                }
                for (let k in tags) {
                    for (let j in itemTags) {
                        if (tags[k] === itemTags[j].name) priority++
                    }
                }
                if (priority > 0) {
                    result.push(items[i])
                }
            }

            const searcher = new textSearch(items, ["name", "parentName", "fields.value", "fields.name", "comments.message"])
            const textFind = searcher.search(values.join(" "))
            if (values.join(" ") !== "") result = [...result, ...textFind]

            res.status(200).json({ ok: true, items: result })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так", error: e.message })
        }
    }
)

router.post(
    "/createComment",
    isAuth,
    async (req, res) => {
        try {
            const item = await itemModel.findOne({ _id: req.body.itemId })

            if(!item) {
                return res.status(400).json({ message: "Итем не найден" })
            }

            item.comments = [...item.comments, {
                username: req.user.username,
                message: req.body.message,
                userId: req.user._id
            }]

            await item.save()

            res.status(201).json({ message: "Комментарий создан", ok: true })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так", error: e.message })
        }
    }
)

router.post(
    "/deleteItem",
    isAuth,
    async (req, res) => {
        try {
            if (req.user.role !== "Admin" && req.user._id.toString() !== req.body.ownerId) {
                return res.status(400).json({ message: "У вас недостаточно прав" })
            }

            const item = await itemModel.findOne({ _id: req.body.id })

            if (!item) {
                return res.status(400).json({ message: "Итем не найден" })
            }

            const collection = await collectionModel.findOne({ _id: req.body.parent })

            collection.items -= 1

            await collection.save()

            for (let i = 0; i < item.tags.length; i++) {
                let tag = await tagModel.findOne({ _id: item.tags[i] })
                tag.value -= 1
                if (tag.value <= 0) {
                    await tagModel.deleteOne({ _id: item.tags[i] })
                } else {
                    let arr = [...tag.items]
                    arr.filter((e) => {
                        return e !== item._id
                    })
                    tag.items = [...arr]
                    await tag.save()
                }
            }

            await itemModel.deleteOne({ _id: req.body.id })

            res.status(200).json({ message: "Удаление прошло успешно", ok: true })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так", error: e.message })
        }
    }
)

router.post(
    "/likeItem",
    isAuth,
    async (req, res) => {
        try {
            const item = await itemModel.findOne({ _id: req.body.id })

            if (!item) {
                return res.status(400).json({ message: "Итем не найден"})
            }

            let like

            if (item.likes.includes(req.user._id)) {
                let arr = [...item.likes]
                item.likes = arr.filter(e => {
                    return e.toString() !== req.user._id.toString()
                })
                like = false
            } else {
                item.likes = [...item.likes, req.user._id]
                like = true
            }

            await item.save()

            res.status(200).json({ ok: true, like })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так", error: e.message })
        }
    }
)

module.exports = router