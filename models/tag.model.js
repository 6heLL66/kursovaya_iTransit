const  { model, Schema } = require("mongoose")

const tagSchema = new Schema({
    name: { type: String, require: true, unique: true },
    value: { type: Number, require: true },
    items: { type: Array, require: true }
})

const tagModel = model("tags", tagSchema)
module.exports = tagModel