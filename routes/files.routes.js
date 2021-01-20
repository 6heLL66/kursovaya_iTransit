const fs = require("fs")

const { Router } = require("express")
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "itransit",
    api_key: "852866318997451",
    api_secret: "EHf3fBn-HR3aqcL_uLIei9gZ_zw"
})

const router = Router()

router.post(
    "/fileUpload",
    async (req, res) => {
        try {
            const file = req.files.file
            return await cloudinary.uploader.upload(file.tempFilePath, {}, (err, data) => {
                if (err) {
                    res.status(400).json({ message: "Не удалось загрузить файл" })
                }
                else {
                    res.status(200).json({
                        message: "Файл загружен",
                        img_id: data.public_id,
                        img_format: data.format,
                        ok: true
                    })
                }
            })
        } catch (e) {
            res.status(500).json({ message: "Не удалось загрузить файл" })
        }
    }
)

module.exports = router