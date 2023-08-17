const express = require("express");
const mongoose = require("mongoose");

const Post = mongoose.model("Post");
const dummyUsers = require("../dummydata/dummyUsers");
JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const authenticateToken = require('../middlewares/authenticateToken')

const router = express.Router();

router.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = dummyUsers.find((u) => u.email === req.user.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user)
    const userProfile = {
      email: user.email,
      followers: user.followers,
      followings: user.followings,
    };
    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to follow a user
router.post("/api/follow/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;
  const authenticatedUser = dummyUsers.find((u) => u.email === req.user.email);
  const userToFollow = dummyUsers.find((u) => u.id === userId);
  // console.log("logged-in follwings", authenticatedUser.followings)
  // console.log("target user follower", userToFollow.followers)

  if (!authenticatedUser || !userToFollow) {
    return res.sendStatus(404);
  }

  // console.log("after")

  // logic to update the followers and followings counts for both users
  authenticatedUser.followings++;
  userToFollow.followers++;

  // console.log("logged-in follwings", authenticatedUser.followings)
  // console.log("target user follower", userToFollow.followers)

  res.json({ message: "User followed successfully" });
});

// Endpoint to unfollow a user
router.post("/api/unfollow/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;
  const authenticatedUser = dummyUsers.find((u) => u.email === req.user.email);
  const userToUnfollow = dummyUsers.find((u) => u.id === userId);
  if (!authenticatedUser || !userToUnfollow) {
    return res.sendStatus(404);
  }
  // console.log("logged-in follwings", authenticatedUser.followings)
  // console.log("target user follower", userToUnfollow.followers)

  // logic to update the followers and followings counts for both users
  userToUnfollow.followers--;
  authenticatedUser.followings--;

  // console.log("after")
  // console.log("logged-in follwings", authenticatedUser.followings)
  // console.log("target user follower", userToUnfollow.followers)

  res.json({ message: "User unfollowed successfully" });
});

module.exports = router;
