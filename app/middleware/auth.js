const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            status: "failed",
            message: "Access denied!"
        });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_API);

        req.users = verified;
        next();
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "Invalid token"
        });
    }
};