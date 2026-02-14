const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.delete("/deleteComment", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    const { photoId, commentId } = req.body;
    try {
        const photo = await Photo.findById(photoId);
        const comment = photo.comments.id(commentId);
        comment.deleteOne();
        await photo.save();
        res.status(200).send({ message: "Comment deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Server error", error });
    }
});
router.put("/editComment", async (req, res) => {
    console.log("Edit comment request body:", req.body);
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    const { photoId, commentId, newComment } = req.body;
    try {
        const photo = await Photo.findById(photoId);
        const comment = photo.comments.id(commentId);
        if (!comment) {
            return res.status(400).send({ message: "Comment not found." });
        }
        comment.comment = newComment;
        await photo.save();
        res.status(200).send({ message: "Comment edited successfully." });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Server error", error });
    }
});
router.post("/:photoId", async (req, res) => {
    const photoId = req.params.photoId;
    const userId = req.session.userId;
    const { comment } = req.body;
    if (!userId) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    try {
        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(400).send({ message: "Photo not found." });
        }
        const newComment = {
            comment: comment,
            user_id: userId,
            date_time: new Date()
        };
        photo.comments.push(newComment);
        await photo.save();
        res.status(200).send({ message: "Comment added successfully." });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Server error", error });
    }
});

module.exports = router;