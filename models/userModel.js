const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add user name"],
    },
    email: {
        type: String,
        required: [true, "Please add the user email address"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add the user password"],
    },
    role: {
        type: String,
        enum: ["user", "admin"], // ✅ Only allow "user" and "admin"
        default: "user",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
