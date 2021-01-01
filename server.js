const express = require("express")
const app = express()

const db = require("./functions/mongoose.connect.js")

app.use(express.json({ extended: true }))
app.use("/api/auth/", require("./routes/auth.routes"))

const PORT = process.env.PORT || 5000

db.connect()
    .then(() => {
        app.listen(PORT, () => console.log("PORT: 5000"))
    })
    .catch((err) => {
        console.log("Server Error", err)
    })



