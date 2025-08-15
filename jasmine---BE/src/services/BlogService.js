const Blog = require("../models/BlogModel");
const BlogComment = require("../models/BlogCommentModel");
const BlogAnswer = require("../models/BlogAnswerModel");
const User = require("../models/UserModel");

// Create a new blog
const createBlog = (newBlog) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { blogTitle, blogContent, blogImage, author } = newBlog;

      // Check for duplicate title
      const checkBlog = await Blog.findOne({ blogTitle });

      if (checkBlog) {
        return resolve({
          status: "ERR",
          message: "Blog with this title already exists.",
        });
      }

      const createdBlog = await Blog.create(newBlog);

      resolve({
        status: "OK",
        message: "Blog created successfully",
        data: createdBlog,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to create blog",
      });
    }
  });
};

// Update blog
const updateBlog = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBlog = await Blog.findById(id);
      if (!existingBlog) {
        return resolve({
          status: "ERR",
          message: "The Blog does not exist",
        });
      }

      const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "Blog updated successfully",
        data: updatedBlog,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Delete blog
const deleteBlog = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBlog = await Blog.findById(id);
      if (!existingBlog) {
        return resolve({
          status: "ERR",
          message: "The Blog does not exist",
        });
      }

      // Delete all comments and answers related to this blog
      await BlogComment.deleteMany({ blog: id });
      await BlogAnswer.deleteMany({ blog: id });

      // Delete the blog
      await Blog.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Blog and related comments/answers deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Get blog details
const getDetailsBlog = (id, isAdmin = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDetails = await Blog.findById(id).populate({
        path: 'author',
        select: 'userName userEmail avatar',
      });

      if (!blogDetails) {
        return resolve({
          status: "ERR",
          message: "The Blog does not exist",
        });
      }

      // Only block access to inactive blogs for non-admin users
      if (!isAdmin && !blogDetails.isActive) {
        return resolve({
          status: "ERR",
          message: "This blog is not available",
        });
      }

      // Update view count
      await Blog.findByIdAndUpdate(id, {
        $inc: { viewCount: 1 }
      });

      resolve({
        status: "OK",
        message: "Blog details retrieved successfully",
        data: blogDetails,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Get all blogs
const getAllBlogs = (limit, page, sort, filter, isAdmin = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {};
      if (filter) {
        const [field, value] = filter.split(":");
        query[field] = { $regex: value, $options: "i" };
      }

      // For non-admin users, exclude inactive blogs
      if (!isAdmin) {
        query.isActive = { $ne: false };
      }

      const totalBlogs = await Blog.countDocuments(query);
      const blogsList = await Blog.find(query)
        .populate({
          path: 'author',
          select: 'userName userEmail avatar',
        })
        .sort(
          sort
            ? { [sort.split(":")[0]]: sort.split(":")[1] === "asc" ? 1 : -1 }
            : { createdAt: -1 }  // Default sort by newest
        )
        .limit(Number(limit))
        .skip(Number(page) * Number(limit));

      resolve({
        status: "OK",
        message: "Blogs retrieved successfully",
        data: blogsList,
        total: totalBlogs,
        currentPage: Number(page) + 1,
        totalPages: Math.ceil(totalBlogs / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Check blog status
const checkBlogStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDetails = await Blog.findById(id);
      if (!blogDetails) {
        return resolve({
          status: "ERR",
          message: "The Blog does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "Blog status retrieved successfully",
        isActive: blogDetails.isActive,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Update blog status
const updateStatusBlog = (id, isActive) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );
      if (!updatedBlog) {
        return resolve({
          status: "ERR",
          message: "The Blog does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "Blog status updated successfully",
        data: updatedBlog,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Add comment to blog
const addComment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { content, user, blog, parentComment } = data;

      // Check if blog exists
      const existingBlog = await Blog.findById(blog);
      if (!existingBlog) {
        return resolve({
          status: "ERR",
          message: "The Blog does not exist",
        });
      }

      // If this is a reply, check if parent comment exists
      if (parentComment) {
        const parentCommentExists = await BlogComment.findById(parentComment);
        if (!parentCommentExists) {
          return resolve({
            status: "ERR",
            message: "Parent comment does not exist",
          });
        }
      }

      // Create comment
      const createdComment = await BlogComment.create(data);

      // Populate user info before sending response
      const populatedComment = await BlogComment.findById(createdComment._id)
        .populate({
          path: 'user',
          select: 'userName userEmail avatar'
        });

      resolve({
        status: "OK",
        message: parentComment ? "Reply added successfully" : "Comment added successfully",
        data: populatedComment,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Get all comments for a blog
const getBlogComments = (blogId, limit = 10, page = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = { blog: blogId, isActive: true, parentComment: null }; // Only get top-level comments

      const totalComments = await BlogComment.countDocuments(query);
      const comments = await BlogComment.find(query)
        .populate({
          path: 'user',
          select: 'userName userEmail avatar',
        })
        .populate({
          path: 'replies',
          match: { isActive: true },
          populate: {
            path: 'user',
            select: 'userName userEmail avatar'
          }
        })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(page) * Number(limit));

      resolve({
        status: "OK",
        message: "Comments retrieved successfully",
        data: comments,
        total: totalComments,
        currentPage: Number(page) + 1,
        totalPages: Math.ceil(totalComments / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Add answer to blog
const addAnswer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { content, user, blog } = data;

      // Check if blog exists
      const existingBlog = await Blog.findById(blog);
      if (!existingBlog) {
        return resolve({
          status: "ERR",
          message: "The Blog does not exist",
        });
      }

      // Create answer
      const createdAnswer = await BlogAnswer.create(data);

      resolve({
        status: "OK",
        message: "Answer added successfully",
        data: createdAnswer,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Get all answers for a blog
const getBlogAnswers = (blogId, limit = 10, page = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = { blog: blogId, isActive: true };

      const totalAnswers = await BlogAnswer.countDocuments(query);
      const answers = await BlogAnswer.find(query)
        .populate({
          path: 'user',
          select: 'name email avatar',
        })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(page) * Number(limit));

      resolve({
        status: "OK",
        message: "Answers retrieved successfully",
        data: answers,
        total: totalAnswers,
        currentPage: Number(page) + 1,
        totalPages: Math.ceil(totalAnswers / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
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