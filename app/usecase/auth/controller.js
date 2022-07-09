const User = require("../user/model")

const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    const schema = Joi.object({
        userName: Joi.string().required(),
        emailAddress: Joi.string().email().required(),
        password: Joi.string().required(),
        identityNumber: Joi.number().required(),
        accountNumber: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: "error",
            message: error.details[0].message,
        });
    }
    try {
        const { emailAddress, userName, password, accountNumber, identityNumber } = req.body

        const userExist = await User.findOne({ emailAddress }).select(['-password'])
        if (userExist) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "email already used",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createUser = await User({ emailAddress, userName, password: hashedPassword, accountNumber, identityNumber })
        await createUser.save()

        const dataToken = {
            _id: createUser._id,
            userName: createUser.userName,
        };

        const token = jwt.sign(dataToken, process.env.TOKEN_API);

        res.status(200).json({
            status: "success register",
            data: { token, user: createUser }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    const schema = Joi.object({
        emailAddress: Joi.string().required(),
        password: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: "error",
            message: error.details[0].message,
        });
    }
    try {
        const { emailAddress, password } = req.body

        let userExist = await User.findOne({ emailAddress })
        if (!userExist) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "user doesn't exist",
            });
        }

        const isValid = await bcrypt.compare(password, userExist.password);
        if (!isValid) {
            return res.status(400).json({
                status: "failed",
                message: "credential is invalid",
            });
        }

        const dataToken = {
            _id: userExist._id,
            userName: userExist.userName,
        };
        const token = jwt.sign(dataToken, process.env.TOKEN_API);

        res.status(200).json({
            status: "success login",
            data: { token, user: userExist }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const dataToken = req.users
        const token = jwt.sign(dataToken, process.env.TOKEN_API);

        const user = await User.findOne({ _id: dataToken._id }).select(['-password'])
        if (!user) {
            return res.status(400).json({
                status: "failed",
                message: "user doen't exist"
            })
        }
        res.status(200).json({
            status: "success refresh token",
            data: { token, user }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}