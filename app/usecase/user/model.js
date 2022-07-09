const mongoose = require("mongoose")

let userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "Nama harus diisi"],
        },
        accountNumber: {
            type: Number,
            required: [true, "Nomor akun harus diisi"],
        },
        identityNumber: {
            type: Number,
            required: [true, "Nomor identitas harus diisi"],
        },
        emailAddress: {
            type: String,
            required: [true, "Email harus diisi"],
        },
        password: {
            type: String,
            required: [true, "Kata sandi harus diisi"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);