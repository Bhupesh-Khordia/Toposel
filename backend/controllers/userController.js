import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// Login
const loginUser = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // Check if all fields are provided
        if (!usernameOrEmail || !password) {
            return res.json({ success: false, message: "All fields are required." });
        }

        // Find user by username or email
        const user = await userModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        });

        if (!user) {
            return res.json({ success: false, message: "User does not exist." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials." });
        }

        const token = createToken(user._id);

        return res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Register endpoint
const registerUser = async (req, res) => {
    try {
        const { fullName, username, email, password, gender, dob, country } = req.body;

        // Check if all fields are provided
        if (!fullName || !username || !email || !password || !gender || !dob || !country) {
            return res.json({ success: false, message: "All fields are required." });
        }

        // Check if username or email already exists in database.
        const usernameExists = await userModel.findOne({ username });
        const emailExists = await userModel.findOne({ email });
        if (usernameExists || emailExists) {
            return res.json({ success: false, message: "Account already exists." });
        }

        // Check if username is valid.
        if (!validator.isAlphanumeric(username)) {
            return res.json({ success: false, message: "Please enter a valid username." });
        }

        // Check if email is valid.
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email." });
        }

        // Check if password is strong enough.
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (at least 8 characters)." });
        }

        // Hash password.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            fullName,
            username,
            email,
            password: hashedPassword,
            gender,
            dob,
            country
        });

        // Add user in model.
        const user = await newUser.save();

        // Create Token for user to let them log in
        const token = createToken(user._id);

        return res.json({ success: true, token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Search User by Email
const searchUserEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.json({ success: false, message: "Email is required." });
        }

        // Check if email is valid
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email." });
        }

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        return res.json({ success: true, user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Search User by Username
const searchUserUsername = async (req, res) => {
    try {
        const { username } = req.body;

        // Check if username is provided
        if (!username) {
            return res.json({ success: false, message: "Username is required." });
        }

        // Check if username is valid
        if (!validator.isAlphanumeric(username)) {
            return res.json({ success: false, message: "Please enter a valid username." });
        }

        // Find user by username
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        return res.json({ success: true, user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export {loginUser, registerUser, searchUserEmail, searchUserUsername }