const User = require("../models/user.js");

module.exports = {
    registerUser: async (userData, password) => {
        const newUser = new User(userData);
        return await User.register(newUser, password);
    }
};
