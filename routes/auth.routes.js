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
            return res.sendStatus(400).json({
                errors,
                message: "Некорректные данные"
            })
        }

        const sameUsername = UserModel.findOne({ username: req.body.username })
        const sameEmail = UserModel.findOne({ email: req.body.email })

        if (sameUsername || sameEmail) {
            return res.sendStatus(400).json({ message: "Пользователь с таким никнеймом или почтой уже существует."})
        }

        const hashedPass = await bcrypt.hash(req.body.password, 16)
        const User = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            collections: []
        })

        await User.save()

        res.sendStatus(200).json({ message: "Пользователь создан."})
    } catch (e) {
        res.sendStatus(500).json({ message: "Что-то пошло не так ):"})
    }
})

router.post(
    "/login",
    async (req, res) => {
        try {
            const user = UserModel.findOne({ username: req.body.username, password: req.body.password })

            if (!user) {
                res.sendStatus(400).json({ message: "Такого пользователя не существует" })
            }

            const isMatch = await bcrypt.compare(user.password, req.body.password)

            if (!isMatch) {
                res.sendStatus(400).json({ message: "Неверный пароль" })
            }

            const token = jwt.sign(
                { userId: user.id },
                "aisfhqiuwhfkjasf124iojlkq1124qsd456ysg",
                { expiresIn: "30m" }
            )

            res.json({ token, userId: user.id })
        } catch(e) {
            res.sendStatus(500).json({ message: "Что-то пошло не так ):"})
        }
    }
)

export default router