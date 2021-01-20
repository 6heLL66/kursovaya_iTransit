const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    email: { type: String, require: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, require: true },
    status: { type: String, require: true },
    type: { type: String, require: true },
    language: { type: String, require: true },
    theme: { type: String, require: true }
})

const userModel = model("users", userSchema)

module.exports = userModel

