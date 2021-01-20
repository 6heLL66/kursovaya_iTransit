const { Router } = require("express")
const UserModel = require("../models/user.model")
const isAdmin = require("../middlewares/admin.middleware")
const isAuth = require("../middlewares/auth.middleware")
const isBlocked = require("../middlewares/block.midleware");
const itemModel = require("../models/item.model");
const collectionModel = require("../models/collection.model");
const tagModel = require("../models/tag.model");
const router = Router()

router.get(
    "/getUsers",
    async(req, res) => {
        try {
            const users = await UserModel.find({})

            res.status(200).json({ data: users })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):" })
        }
    }
)

router.post(
    "/getUser",
    async(req, res) => {
        try {
            const user = await UserModel.findOne({ _id: req.body.id })

            if(!user) {
                return res.status(400).json({ message: "Такого пользователя не существует" })
            }

            res.status(200).json({ user })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):" })
        }
    }
)

router.post(
    "/deleteUser",
    [
        isAuth,
        isBlocked,
        isAdmin
    ],
    async(req, res) => {
        try {
            let collections = await collectionModel.find({ ownerId: req.body._id })
            for (let i = 0; i < collections.length; i++) {
                let items = await itemModel.find({ parent: collections[i]._id })


                for (let j = 0; j < items.length; j++) {
                    for (let h = 0; h < items[j].tags.length; h++) {
                        let tag = await tagModel.findOne({ _id: items[j].tags[h] })
                        tag.value -= 1
                        if (tag.value <= 0) await tagModel.deleteOne({ _id: items[j].tags[h] })
                        else {
                            let arr = [...tag.items]
                            arr.filter((e) => {
                                return e !== items[j]._id
                            })
                            tag.items = [...arr]
                            await tag.save()
                        }
                    }
                    await itemModel.deleteOne( {_id: items[j]._id })
                }
                await collectionModel.deleteOne({ _id: collections[i]._id })
            }

            await UserModel.deleteOne({ _id: req.body._id })

            return res.status(200).json({ message: "Пользователь удален" })

        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):", error: e.message })
        }
    }
)

router.post(
    "/blockUser",
    [
        isAuth,
        isBlocked,
        isAdmin
    ],
    async(req, res) => {
        try {
            const user = await UserModel.findOne({ _id: req.body._id })

            if(!user) {
                return res.status(400).json({ message: "Такого пользователя не существует"})
            }

            user.status = "blocked"
            await user.save()

            res.status(200).json({ message: "Пользователь заблокирован" })
        } catch(e) {
            res.status(500).json({ message: e.message || "Что-то пошло не так ):" })
        }
    }
)

router.post(
    "/unblockUser",
    [
        isAuth,
        isBlocked,
        isAdmin
    ],
    async(req, res) => {
        try {
            const user = await UserModel.findOne({ _id: req.body._id })

            if(!user) {
                return res.status(400).json({ message: "Такого пользователя не существует" })
            }

            user.status = "not blocked"
            await user.save()

            return res.status(200).json({ message: "Пользователь разблокирован" })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):" })
        }
    }
)

router.post(
    "/appointAdmin",
    [
        isAuth,
        isBlocked,
        isAdmin
    ],
    async(req, res) => {
        try {
            const user = await UserModel.findOne({ _id: req.body._id })

            if(!user) {
                return res.status(400).json({ message: "Такого пользователя не существует"})
            }

            user.role = "Admin"
            await user.save()

            return res.status(200).json({ message: "Пользователь назначен администратором"})
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):" })
        }
    }
)

router.post(
    "/removeAdmin",
    [
        isAuth,
        isBlocked,
        isAdmin
    ],
    async(req, res) => {
        try {
            const user = await UserModel.findOne({ _id: req.body._id })

            if(!user) {
                return res.status(400).json({ message: "Такого пользователя не существует" })
            }

            user.role = "User"
            await user.save()

            return res.status(200).json({ message: "Пользователь снят с поста администратора" })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):" })
        }
    }
)

router.post(
    "/setLanguage",
    [
        isAuth
    ],
    async(req, res) => {
        try {
            const user = await UserModel.findOne({ _id: req.user._id })

            if(!user) {
                return res.status(400).json({ message: "Такого пользователя не существует"})
            }

            user.language = req.body.language
            await user.save()

            return res.status(200).json({ message: "Язык изменен", ok: true })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):" })
        }
    }
)

router.post(
    "/setTheme",
    [
        isAuth
    ],
    async(req, res) => {
        try {
            const user = await UserModel.findOne({ _id: req.user._id })

            if(!user) {
                return res.status(400).json({ message: "Такого пользователя не существует"})
            }

            user.theme = req.body.theme
            await user.save()

            return res.status(200).json({ message: "Тема изменена", ok: true })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):" })
        }
    }
)

module.exports = router