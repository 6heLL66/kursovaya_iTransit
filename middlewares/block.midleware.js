const userModel = require("../models/user.model");


async function isBlocked(req, res, next) {
    try {
        if (req.user.status === "blocked") {
            return res.status(400).json({ message: "Ваш аккаунт заблокирован" })
        }
        next()
    } catch(e) {
        res.status(500).json({ message: "Что-то пошло не так", error: e })
    }
}

module.exports = isBlocked