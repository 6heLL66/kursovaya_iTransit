const mongoose = require("mongoose")

async function connect() {
    try {
        await mongoose.connect(
            "mongodb+srv://danik:12345678d@cluster0.1utor.mongodb.net/kurs?retryWrites=true&w=majority",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        )
    } catch (e) {
        console.log("Server Error", e.message)
        process.exit(1)
    }
}
module.exports = { connect }