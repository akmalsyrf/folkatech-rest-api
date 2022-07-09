const express = require("express")
const router = express.Router()

const { register, login, refreshToken } = require("./controller")
const auth = require("../../middleware/auth")

router.post('/register', register)
router.post("/login", login)
router.get("/refresh-token", auth, refreshToken)

module.exports = router