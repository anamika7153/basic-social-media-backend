const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Post = mongoose.model("Post");
const dummyUsers = require("../dummydata/dummyUsers");
const authenticateToken = require('../middlewares/authenticateToken')
const router = express.Router();

router.get("/api/", (req,res) => {
  res
      .status(200)
      .json({ message: "Welcome to Social Media Backend" });
})

// Endpoint to add a new post
router.post("/api/posts", authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const authenticatedUser = dummyUsers.find((u) => u.email === req.user.email); 

  if(!title || !description) {
    return res.sendStatus(400);
  }
  if (!authenticatedUser) {
    return res.sendStatus(401);
  }

  try {
    const newPost = new Post({
      title,
      description,
      author: {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
      },
    });

    const savedPost = await newPost.save();
    const {
      _id,
      title: savedTitle,
      description: savedDescription,
      createdAt,
    } = savedPost;

    res.status(200).json({
      postId: _id,
      title: savedTitle,
      description: savedDescription,
      createdAt,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the post." });
  }
});

// Endpoint to delete a post
router.delete("/api/posts/:id", authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const authenticatedUser = dummyUsers.find((u) => u.email === req.user.email); 

  if (!authenticatedUser) {
    return res.sendStatus(401);
  }

  try {
    // Find the post by ID and ensure it was created by the authenticated user
    const postToDelete = await Post.findOne({ _id: postId,'author.id': authenticatedUser.id });
    if (!postToDelete) {
      return res.status(404).json({
        message: "Post not found or not created by the authenticated user",
      });
    }
    await postToDelete.deleteOne({ _id: postId });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the post." });
  }
});

// Endpoint to like a post
router.post("/api/like/:id", authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const authenticatedUser = dummyUsers.find((u) => u.email === req.user.email); 

  if (!authenticatedUser) {
    return res.sendStatus(401);
  }

  try {
    const postToLike = await Post.findById(postId);
    if (!postToLike) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the user has already liked the post
    if (postToLike.likes.find((like) => like.email === authenticatedUser.email)) {
      return res
        .status(400)
        .json({ message: "Post is already liked by the user" });
    }
    // Add the user's ID and email to the post's likes array
    postToLike.likes.push({
      userid: authenticatedUser.id,
      email: authenticatedUser.email,
    });

    await postToLike.save();

    res.json({ message: "Post liked successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post." });
  }
});

// Endpoint to unlike a post
router.post("/api/unlike/:id", authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const authenticatedUser = dummyUsers.find((u) => u.email === req.user.email); 

  if (!authenticatedUser) {
    return res.sendStatus(401);
  }

  try {
    const postToUnlike = await Post.findById(postId);
    if (!postToUnlike) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the user has already liked the post
    const likedIndex = postToUnlike.likes.findIndex(
      (like) => like.userid === authenticatedUser.id
    );
    // Remove the user's ID from the post's likes array
    postToUnlike.likes.splice(likedIndex, 1);
    await postToUnlike.save();

    res.json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while unliking the post." });
  }
});

// Endpoint to comment on a post
router.post("/api/comment/:id", authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const { comment } = req.body;
  const authenticatedUser = dummyUsers.find((u) => u.email === req.user.email); 

  if (!authenticatedUser) {
    return res.sendStatus(401);
  }

  try {
    const postToAddComment = await Post.findById(postId);
    if (!postToAddComment) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Add the comment to the post's comments array
    postToAddComment.comments.push({
      user: authenticatedUser.email,
      text: comment,
    });
    await postToAddComment.save();
    const newComment = postToAddComment.comments.slice(-1)[0]; 

    res.json({ commentId: newComment._id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the comment." });
  }
});

// Endpoint to get specific post
router.get("/api/posts/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Calculate the number of likes and comments
    const numLikes = post.likes.length;
    const numComments = post.comments.length;

    const postWithLikesAndComments = {
      _id: post._id,
      title: post.title,
      description: post.description,
      author: post.author,
      likes: numLikes,
      comments: numComments,
    };

    res.json(postWithLikesAndComments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the post." });
  }
});

// Endpoint to get  all posts posted by the user
router.get("/api/all_posts", authenticateToken, async (req, res) => {
  const authenticatedUser = dummyUsers.find((u) => u.email === req.user.email); 

  if (!authenticatedUser) {
    return res.sendStatus(401);
  }

  try {
    // Find all posts created by the authenticated user
    const userPosts = await Post.find({
      "author.id": authenticatedUser.id,
    }).sort({ createdAt: -1 });

    // Construct the response array with required details
    const responseArray = userPosts.map((post) => ({
      id: post._id,
      title: post.title,
      desc: post.description,
      created_at: post.createdAt,
      comments: post.comments,
      likes: post.likes.length,
    }));

    res.json(responseArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the posts." });
  }
});

module.exports = router;
