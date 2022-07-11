const User = require("./model")
const bcrypt = require("bcryptjs");
const Redis = require("../../utils/redis")

exports.getAllUser = async (req, res) => {
    try {
        const value = await Redis.get("getAllUsers")
        let users
        if (value) {
            console.log("get data from redis")
            users = JSON.parse(value)
            res.status(200).json({
                status: "success",
                data: { users }
            })
        } else {
            console.log("get data from db")
            users = await User.find().select(['-password', '-accountNumber', '-identityNumber', '-createdAt', '-updatedAt'])
            Redis.set("getAllUsers", JSON.stringify(users))
            res.status(200).json({
                status: "success",
                data: { users }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const { accountNumber, identityNumber } = req.query
        let user
        if (accountNumber && identityNumber) {
            user = await User.findOne({ accountNumber, identityNumber }).select(['-password'])
            res.status(200).json({
                status: `success get user`,
                data: { user }
            })
        } else if (accountNumber) {
            user = await User.findOne({ accountNumber }).select(['-password'])
            res.status(200).json({
                status: `success get user`,
                data: { user }
            })
        } else if (identityNumber) {
            user = await User.findOne({ identityNumber }).select(['-password'])
            res.status(200).json({
                status: `success get user`,
                data: { user }
            })
        } else {
            res.status(400).json({
                status: "failed",
                message: "You must provide account number or identity number"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { _id } = req.users
        const { userName, emailAddress, accountNumber, identityNumber, old_password, new_password } = req.body

        if (old_password && new_password) {
            const userExist = await User.findOne({ _id })
            const isValid = await bcrypt.compare(old_password, userExist.password);

            if (!isValid) {
                return res.status(400).json({
                    status: "failed",
                    message: "credential is invalid",
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(new_password, salt);

            await User.updateOne({ _id }, { userName, emailAddress, password: hashedPassword, accountNumber, identityNumber, })
        } else {
            await User.updateOne({ _id }, { userName, emailAddress, accountNumber, identityNumber, })
        }
        const userUpdated = await User.findOne({ _id }).select(['-password'])

        res.status(200).json({
            status: "success update user",
            data: { user: userUpdated }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { _id } = req.params
        await User.deleteOne({ _id })
        res.status(200).json({
            status: "success deleted your account",
            message: `Delete user id ${_id} success`
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}