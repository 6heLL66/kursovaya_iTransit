const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model");

async function isAuth(req, res, next) {
    try {
        jwt.verify(req.body.token, "aisfhqiuwhfkjasf124iojlkq1124qsd456ysg", async (err, decoded) => {
            if (err) {
                return res.status(100).json({ message: err })
            }
            else {
                const user = await userModel.findOne( { _id: decoded.userId })

                req.user = user
                next()
            }
        })
    } catch(e) {
        res.status(500).json({ message: "Что-то пошло не так", error: e })
    }
}

module.exports = isAuth