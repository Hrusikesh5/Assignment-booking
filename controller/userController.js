const User = require('../models/User');

exports.addUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to add user", error: error.message });
    }
};
