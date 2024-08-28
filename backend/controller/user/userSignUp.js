const userModel = require("../../models/userModel");
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
    try {
        const { email, password, name, role } = req.body;

        const user = await userModel.findOne({ email });

        if (user) {
            throw new Error("User already exists.");
        }

        if (!email) {
            throw new Error("Please provide an email.");
        }
        if (!password) {
            throw new Error("Please provide a password.");
        }
        if (!name) {
            throw new Error("Please provide a name.");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Something went wrong with password hashing.");
        }

        const payload = {
            ...req.body,
            role: role || "GENERAL", // Use the provided role, or default to "GENERAL"
            password: hashPassword
        };

        const userData = new userModel(payload);
        const saveUser = await userData.save();

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User created successfully!"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;
