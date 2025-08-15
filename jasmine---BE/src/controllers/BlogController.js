const BlogService = require("../services/BlogService");
const uploadCloudinary = require("../Helper/UploadCloudinary");
const Blog = require("../models/BlogModel");

// Create new blog
const createBlog = async (req, res) => {
  try {
    console.log("Request headers:", req.headers);
    console.log("Request user:", req.user);
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { blogTitle, blogContent } = req.body;

    // Check required fields
    if (!blogTitle || !blogContent || !req.file) {
      return res.status(400).json({
        status: "ERR",
        message: "Blog title, content and image are required",
      });
    }

    const blogImage = req.file.path;
    const author = req.user.id; // Get author from authenticated user

    console.log("Blog data to be created:", {
      blogTitle,
      blogContent,
      blogImage,
      author
    });

    const newBlog = {
      blogTitle,
      blogContent,
      blogImage,
      author,
    };

    const response = await BlogService.createBlog(newBlog);
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error in createBlog:", e);
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const data = req.body;

    // Add blogImage if file is uploaded
    if (req.file) {
      data.blogImage = req.file.path;
    }

    if (!blogId) {
      return res.status(400).json({
        status: "ERR",
        message: "Blog ID is required",
      });
    }

    const response = await BlogService.updateBlog(blogId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!blogId) {
      return res.status(400).json({
        status: "ERR",
        message: "Blog ID is required",
      });
    }

    const response = await BlogService.deleteBlog(blogId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Get blog details
const getDetailsBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    // Consider user as non-admin if not authenticated
    const isAdmin = req.user?.isAdmin || false;

    if (!blogId) {
      return res.status(400).json({
        status: "ERR",
        message: "Blog ID is required",
      });
    }

    const response = await BlogService.getDetailsBlog(blogId, isAdmin);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const { limit = 10, page = 0, sort, filter } = req.query;
    // Consider user as non-admin if not authenticated
    const isAdmin = req.user?.isAdmin || false;

    const response = await BlogService.getAllBlogs(
      Number(limit),
      Number(page),
      sort,
      filter,
      isAdmin
    );

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Check blog status
const checkBlogStatus = async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!blogId) {
      return res.status(400).json({
        status: "ERR",
        message: "Blog ID is required",
      });
    }

    const response = await BlogService.checkBlogStatus(blogId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Update blog status (active/inactive)
const updateStatusBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { isActive } = req.body;

    if (!blogId) {
      return res.status(400).json({
        status: "ERR",
        message: "Blog ID is required",
      });
    }

    if (isActive === undefined) {
      return res.status(400).json({
        status: "ERR",
        message: "isActive status is required",
      });
    }

    const response = await BlogService.updateStatusBlog(blogId, isActive);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Add comment to blog
const addComment = async (req, res) => {
  try {
    const { content, blog } = req.body;

    if (!content || !blog) {
      return res.status(400).json({
        status: "ERR",
        message: "Comment content and blog ID are required",
      });
    }

    const user = req.user.id; // Get user from authenticated user

    const commentData = {
      content,
      user,
      blog,
    };

    const response = await BlogService.addComment(commentData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Get all comments for a blog
const getBlogComments = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { limit = 10, page = 0 } = req.query;

    if (!blogId) {
      return res.status(400).json({
        status: "ERR",
        message: "Blog ID is required",
      });
    }

    const response = await BlogService.getBlogComments(
      blogId,
      Number(limit),
      Number(page)
    );

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Add answer to blog
const addAnswer = async (req, res) => {
  try {
    const { content, blog } = req.body;

    if (!content || !blog) {
      return res.status(400).json({
        status: "ERR",
        message: "Answer content and blog ID are required",
      });
    }

    const user = req.user.id; // Get user from authenticated user

    const answerData = {
      content,
      user,
      blog,
    };

    const response = await BlogService.addAnswer(answerData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Get all answers for a blog
const getBlogAnswers = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { limit = 10, page = 0 } = req.query;

    if (!blogId) {
      return res.status(400).json({
        status: "ERR",
        message: "Blog ID is required",
      });
    }

    const response = await BlogService.getBlogAnswers(
      blogId,
      Number(limit),
      Number(page)
    );

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getDetailsBlog,
  getAllBlogs,
  checkBlogStatus,
  updateStatusBlog,
  addComment,
  getBlogComments,
  addAnswer,
  getBlogAnswers,
};