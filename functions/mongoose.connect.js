const mongoose = require("mongoose")

async function connect() {
    try {
        await mongoose.connect(
            "mongodb://danik:getlost666@cluster0-shard-00-00.1utor.mongodb.net:27017,cluster0-shard-00-01.1utor.mongodb.net:27017,cluster0-shard-00-02.1utor.mongodb.net:27017/kurs?replicaSet=atlas-12683t-shard-0&ssl=true&authSource=admin",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        )
    } catch (e) {
        console.log("Server Error", e)
    }
}
module.exports = { connect }