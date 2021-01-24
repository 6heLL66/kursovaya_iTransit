const { Router } = require("express")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const isAuth = require("../middlewares/auth.middleware");
const isBlocked = require("../middlewares/block.midleware");
const router = Router()

router.post(
    "/register",
    [
        check("email", "Некорректный email").isEmail(),
        check("username", "Некорректный username").isLength({ min: 3, max: 16 }),
        check("password", "Некорректный пароль").isLength({ min: 6, max: 16 })
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Некорректные данные"
            })
        }
        const sameUsername = await UserModel.findOne({ username: req.body.username })
        const sameEmail = await UserModel.findOne({ email: req.body.email })

        if (sameUsername || sameEmail) {
            return res.status(400).json({ message: "Пользователь с таким никнеймом или почтой уже существует."})
        }

        const hashedPass = await bcrypt.hash(req.body.password, 8)
        const User = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            role: req.body.role,
            status: "not blocked",
            type: "common",
            language: req.body.lang,
            theme: req.body.theme,
            collections: []
        })

        await User.save()

        res.status(200).json({ message: "Пользователь создан."})
    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так ):"})
    }
})

router.post(
    "/login",
    async (req, res) => {
        try {
            if (req.body.type === "common") {
                const user = await UserModel.findOne({ username: req.body.user.username })

                if (!user) {
                    return res.status(400).json({ message: "Такого пользователя не существует" })
                }

                const isMatch = await bcrypt.compare(req.body.user.password, user.password)

                if (!isMatch) {
                    return res.status(400).json({ message: "Неверный пароль" })
                }

                const token = jwt.sign(
                    { userId: user._id },
                    "aisfhqiuwhfkjasf124iojlkq1124qsd456ysg",
                    { expiresIn: "6h" }
                )

                res.json({ token, user: user, ok: true })
            }
            else if (req.body.type === "google") {
                const user = await UserModel.findOne({ email: req.body.user.email })

                if (user) {
                    const token = jwt.sign(
                        { userId: user._id },
                        "aisfhqiuwhfkjasf124iojlkq1124qsd456ysg",
                        { expiresIn: "6h" }
                    )
                    return res.status(200).json({ token, message: "Пользователь уже записан", user, ok: true })
                }

                const newUser = new UserModel({
                    email: req.body.user.email,
                    username: req.body.user.familyName + " " + req.body.user.givenName,
                    password: "google_auth",
                    type: "google",
                    role: "User",
                    language: req.body.lang,
                    theme: req.body.theme,
                    status: "not blocked",
                    collections: []
                })

                await newUser.save()

                const token = jwt.sign(
                    { userId: newUser._id },
                    "aisfhqiuwhfkjasf124iojlkq1124qsd456ysg",
                    { expiresIn: "6h" }
                )

                res.status(201).json({ token, message: "Пользователь создан", ok: true, user: newUser })
            }
            else if (req.body.type === "vk") {
                const user = await UserModel.findOne({ email: req.body.user.uid })

                if (user) {
                    const token = jwt.sign(
                        { userId: user._id },
                        "aisfhqiuwhfkjasf124iojlkq1124qsd456ysg",
                        { expiresIn: "6h" }
                    )
                    return res.status(200).json({ token, message: "Пользователь уже записан", user, ok: true })
                }

                const newUser = new UserModel({
                    email: req.body.user.uid,
                    username: req.body.user.first_name + " " + req.body.user.last_name,
                    password: "vk_auth",
                    type: "vk",
                    role: "User",
                    language: req.body.lang,
                    theme: req.body.theme,
                    status: "not blocked",
                    collections: []
                })

                await newUser.save()

                const token = jwt.sign(
                    { userId: newUser._id },
                    "aisfhqiuwhfkjasf124iojlkq1124qsd456ysg",
                    { expiresIn: "6h" }
                )

                res.status(201).json({ token, message: "Пользователь создан", ok: true, user: newUser })
            }

        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):"})
        }
    }
)

router.post(
    "/auth",
    [
        isAuth,
        isBlocked
    ],
    (req, res) => {
        res.status(200).json({ message: "Вы авторизованы", ok: true, user: req.user })
    }
)



module.exports = router