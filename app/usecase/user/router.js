const express = require("express")
const router = express.Router()

const { getAllUser, getUser, updateUser, deleteUser } = require("./controller")
const auth = require("../../middleware/auth")

router.get("/users", auth, getAllUser)
router.get("/user", auth, getUser)
router.put("/user", auth, updateUser)
router.delete("/user", auth, deleteUser)

module.exports = router