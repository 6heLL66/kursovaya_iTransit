const jwt = require("jsonwebtoken")

function isAdmin(req, res, next) {
    if (req.user.role === "Admin"){
        next()
    }
    else {
        res.status.json({ message: "Недостаточно прав для этого действия"})
    }
}

module.exports = isAdmin