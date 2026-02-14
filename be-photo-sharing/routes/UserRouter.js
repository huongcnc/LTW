const express = require("express");
const User = require("../db/userModel");
const router = express.Router();


router.get("/list", async (request, response) => {
  const user = await User.find({}, "_id first_name last_name ");
  response.json(user);
});

router.get("/:id", async (request, response) => {
  try {
    const user = await User.find(
      { _id: request.params.id },
      "_id first_name last_name location description occupation"
    );
    response.json(user[0]);
  } catch (error) {
    response.status(400).send({ error });
  }
});

module.exports = router;
