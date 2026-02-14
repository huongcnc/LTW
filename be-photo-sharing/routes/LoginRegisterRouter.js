const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.get("/check-login", (request, response) => {
    if (request.session.userId) {
        response.send({ userId: request.session.userId });
    } else {
        response.status(401).send({ loggedIn: false });
    }
});

router.post("/login", async (request, response) => {
    const { username, password } = request.body;
    const user = await User.find({ username, password }, "_id");

    if (user.length > 0) {
        request.session.userId = user[0]._id;
        response.send({ message: "Login successful", userId: user[0]._id });
    } else {
        response.status(401).send({ message: "Invalid username or password" });
    }
});

router.post("/logout", async (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            response.status(500).send({ message: "Logout failed" });
        } else {
            response.redirect("/");
        }
    });
});
router.post("/register", async (request, response) => {
    try {
        const { username, password, first_name, last_name, occupation, location, description } = request.body;
        console.log(request.body);
        const user = new User({ username, password, first_name, last_name, occupation, location, description});
        await user.save();
        response.send({ message: "Registration successful" });
    } catch (error) {
        console.error("Error during registration:", error);
        response.status(500).send({ message: "Registration failed", error });
    }
});
module.exports = router;