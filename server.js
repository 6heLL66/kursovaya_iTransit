const express = require("express")
const upload = require("express-fileupload")
const path = require("path")
const app = express()

const db = require("./functions/mongoose.connect.js")

app.use(express.json({ limit: '15mb' }))
app.use(upload({
    limits: { fileSize: 15 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))


app.use("/api/users/", require("./routes/users.routes"))
app.use("/api/auth/", require("./routes/auth.routes"))
app.use("/api/files/", require("./routes/files.routes"))
app.use("/api/collections/", require("./routes/collections.routes"))
app.use("/api/items/", require("./routes/items.routes"))

if (process.env.NODE_ENV === "production") {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const PORT = process.env.PORT || 5000

db.connect()
    .then(() => {
        app.listen(PORT, () => console.log("PORT: ${PORT}"))
    })
    .catch((err) => {
        console.log("Server Error", err)
        process.exit(0)
    })


