const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const upload = require("../middlewares/upload");
const router = express.Router();
const fs = require("fs");

router.post("/uploadPhoto", upload.single("photo"), async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const newPhoto = new Photo({
      file_name: req.file.filename,
      user_id: userId,
      date_time: new Date(),
      comments: [],
    });
    await newPhoto.save();
    res.status(200).send({ message: "Photo uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Server error", error });
  }
});
router.delete("/deletePhoto/:id", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const photoId = req.params.id;
  try {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).send({ message: "Photo not found." });
    }
    if (photo.user_id.toString() !== userId) {
      return res.status(403).send({ message: "Forbidden" });
    }
    await Photo.findByIdAndDelete(photoId);
    fs.unlinkSync(`public/images/${photo.file_name}`);
    res.status(200).send({ message: "Photo deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Server error", error });
  }
});
router.get("/list", async (req, res) => {
  try {
    const photos = await Photo.find()
      .select("_id user_id comments file_name date_time")
      .populate({
        path: "user_id",
        select: "_id first_name last_name",
        model: "Users",
      });
    res.status(200).send(photos);
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Server error", error });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select("_id first_name last_name");
    if (!user) {
      return res.status(400).send({
        message: "User not found.",
      });
    }

    const photos = await Photo.find({ user_id: userId })
      .select("_id user_id comments file_name date_time")
      .populate({
        path: "comments.user_id",
        select: "_id first_name last_name",
        model: "Users",
      });

    const result = photos.map((photo) => ({
      _id: photo._id,
      user_id: photo.user_id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: photo.comments.map((c) => ({
        _id: c._id,
        comment: c.comment,
        date_time: c.date_time,
        user: c.user_id,
      })),
    }));
    result.sort((a, b) => b.date_time - a.date_time);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Server error", error });
  }
});



module.exports = router;
