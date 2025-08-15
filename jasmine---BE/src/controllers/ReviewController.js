const ReviewService = require("../services/ReviewService");

class ReviewController {
  // Get all reviews for a specific product
  async getAllReviewsByProduct(req, res) {
    try {
      const { productId } = req.params;
      if (!productId) {
        return res.status(400).json({
          status: "ERR",
          message: "Product ID is required"
        });
      }

      const response = await ReviewService.getAllReviewsByProduct(productId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "ERR",
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Create a new review
  async createReview(req, res) {
    try {
      const { productId, userId, rating, comment, username } = req.body;

      if (!productId || !userId || !rating || !comment || !username) {
        return res.status(400).json({
          status: "ERR",
          message: "Missing required fields"
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          status: "ERR",
          message: "Rating must be between 1 and 5"
        });
      }

      const response = await ReviewService.createReview(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "ERR",
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Update an existing review
  async updateReview(req, res) {
    try {
      const reviewId = req.params.id;
      const { rating, comment } = req.body;

      if (!reviewId) {
        return res.status(400).json({
          status: "ERR",
          message: "Review ID is required"
        });
      }

      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          status: "ERR",
          message: "Rating must be between 1 and 5"
        });
      }

      const response = await ReviewService.updateReview(reviewId, req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "ERR",
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Toggle review visibility (admin only)
  async toggleReviewVisibility(req, res) {
    try {
      const reviewId = req.params.id;

      if (!reviewId) {
        return res.status(400).json({
          status: "ERR",
          message: "Review ID is required"
        });
      }

      const response = await ReviewService.toggleReviewVisibility(reviewId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "ERR",
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Delete a review
  async deleteReview(req, res) {
    try {
      const reviewId = req.params.id;

      if (!reviewId) {
        return res.status(400).json({
          status: "ERR",
          message: "Review ID is required"
        });
      }

      const response = await ReviewService.deleteReview(reviewId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "ERR",
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Get all reviews for admin page
  async getAllReviews(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const response = await ReviewService.getAllReviews(parseInt(page), parseInt(limit));
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "ERR",
        message: "Internal server error",
        error: error.message
      });
    }
  }
}

module.exports = new ReviewController();