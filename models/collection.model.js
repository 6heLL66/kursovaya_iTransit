const { Schema, model } = require("mongoose")

const collectionSchema = new Schema({
    ownerId: { type: String, require: true },
    ownerName: { type: String, require: true },
    name: { type: String, require: true },
    theme: { type: String, require: true },
    items: { type: Number, require: true },
    description: { type: String, require: true },
    advancedFields: { type: Array, require: true },
    img_id: { type: String, require: true },
    img_format: { type: String, require: true }
})

const collectionModel = model("collections", collectionSchema)

module.exports = collectionModel

