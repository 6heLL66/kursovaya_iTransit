const { Router } = require("express")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
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
            const user = await UserModel.findOne({ username: req.body.username })

            if (!user) {
                return res.status(400).json({ message: "Такого пользователя не существует" })
            }

            const isMatch = await bcrypt.compare(req.body.password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: "Неверный пароль" })
            }

            const token = jwt.sign(
                { userId: user._id },
                "aisfhqiuwhfkjasf124iojlkq1124qsd456ysg",
                { expiresIn: "30m" }
            )

            res.json({ token, userId: user._id })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):"})
        }
    }
)

router.post(
    "/auth",
    async (req, res) => {
        try {
            const decoded = jwt.verify(req.body.token,
                "aisfhqiuwhfkjasf124iojlkq1124qsd456ysg",
                (err, decoded) => {
                    if (err) {
                        res.status(100).json({ message: "Невалидный токен", data: false })
                    }
                    else {
                        res.status(100).json({ message: "Успешная авторизация", data: true })
                    }
                })
        } catch(e) {
            res.status(500).json({ message: "Что-то пошло не так ):"})
        }
    }
)

module.exports = router