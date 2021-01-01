const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    collections: { type: Array }
})

const userModel = model("users", userSchema)

module.exports = userModel

