const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");

// Get all blog posts
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username email");
    res.send(blogs);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get a single blog post
router.get("/:postId", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.postId).populate(
      "author",
      "username email"
    );
    res.send(blog);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Create a new blog post
router.post("/", auth, async (req, res) => {
  const { title, content, imageUrl } = req.body;

  const blog = new Blog({
    title,
    content,
    imageUrl,
    author: req.user._id,
  });

  try {
    const savedBlog = await blog.save();
    res.send(savedBlog);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a blog post
router.delete("/:postId", auth, async (req, res) => {
  try {
    const removedBlog = await Blog.deleteOne({
      _id: req.params.postId,
      author: req.user._id,
    });
    res.send(removedBlog);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update a blog post
router.put("/:postId", auth, async (req, res) => {
  const { title, content, imageUrl } = req.body;

  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: req.params.postId, author: req.user._id },
      { title, content, imageUrl },
      { new: true }
    );
    res.send(updatedBlog);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get filtered list of posts
router.get("/filter", async (req, res) => {
  const { title, author } = req.query;
  let filter = {};

  if (title) filter.title = new RegExp(title, "i");
  if (author) filter.author = author;

  try {
    const blogs = await Blog.find(filter).populate("author", "username email");
    res.send(blogs);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
