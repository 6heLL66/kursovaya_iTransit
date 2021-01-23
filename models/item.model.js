const { Schema, model } = require("mongoose")


const itemSchema = new Schema({
    parent: { type: String, require: true },
    parentName: { type: String, require: true },
    name: { type: String, require: true },
    ownerId: { type: String, require: true },
    likes: { type: Array, require: true },
    tags: { type: Array, require: true },
    fields: { type: Array, require: true },
    comments: { type: Array, require: true },
    img_id: { type: String },
    img_format: { type: String },
})

const itemModel = model("items", itemSchema)

module.exports = itemModel