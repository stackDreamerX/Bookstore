const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const mongoose = require("mongoose");

// Get all reviews for a specific product
const getAllReviewsByProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const reviews = await Review.find({
        productId: productId,
        isVisible: true
      }).sort({ createdAt: -1 });

      if (!reviews || reviews.length === 0) {
        resolve({
          status: "OK",
          message: "No reviews found for this product",
          data: []
        });
      } else {
        resolve({
          status: "OK",
          message: "Get reviews successfully",
          data: reviews
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Create a new review
const createReview = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { productId, userId, rating, comment, username } = data;

      // Check if user has already reviewed this product
      const existingReview = await Review.findOne({ productId, userId });
      if (existingReview) {
        resolve({
          status: "ERR",
          message: "You have already reviewed this product"
        });
        return;
      }

      // Create new review
      const newReview = await Review.create({
        productId,
        userId,
        rating,
        comment,
        username,
        isVisible: true
      });

      if (newReview) {
        // Update product's average rating and review count
        await updateProductRatings(productId);

        resolve({
          status: "OK",
          message: "Review created successfully",
          data: newReview
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Update an existing review
const updateReview = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { rating, comment } = data;

      const review = await Review.findById(id);
      if (!review) {
        resolve({
          status: "ERR",
          message: "Review not found"
        });
        return;
      }

      // Update review
      review.rating = rating || review.rating;
      review.comment = comment || review.comment;
      await review.save();

      // Update product's average rating
      await updateProductRatings(review.productId);

      resolve({
        status: "OK",
        message: "Review updated successfully",
        data: review
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Toggle review visibility (admin only)
const toggleReviewVisibility = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const review = await Review.findById(id);
      if (!review) {
        resolve({
          status: "ERR",
          message: "Review not found"
        });
        return;
      }

      // Toggle visibility
      review.isVisible = !review.isVisible;
      await review.save();

      // Update product's average rating if necessary
      await updateProductRatings(review.productId);

      resolve({
        status: "OK",
        message: `Review ${review.isVisible ? 'visible' : 'hidden'} successfully`,
        data: review
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Delete a review
const deleteReview = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const review = await Review.findByIdAndDelete(id);
      if (!review) {
        resolve({
          status: "ERR",
          message: "Review not found"
        });
        return;
      }

      // Update product's average rating
      await updateProductRatings(review.productId);

      resolve({
        status: "OK",
        message: "Review deleted successfully"
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Get all reviews for admin page
const getAllReviews = (page = 1, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (page - 1) * limit;

      const reviews = await Review.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Review.countDocuments();

      resolve({
        status: "OK",
        message: "Get all reviews successfully",
        data: reviews,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to update a product's average rating and review count
const updateProductRatings = async (productId) => {
  try {
    const visibleReviews = await Review.find({
      productId: productId,
      isVisible: true
    });

    const reviewCount = visibleReviews.length;

    let averageRating = 0;
    if (reviewCount > 0) {
      const totalRating = visibleReviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = parseFloat((totalRating / reviewCount).toFixed(1));
    }

    await Product.findByIdAndUpdate(productId, {
      averageRating,
      reviewCount
    });

    return { averageRating, reviewCount };
  } catch (error) {
    console.error("Error updating product ratings:", error);
    throw error;
  }
};

module.exports = {
  getAllReviewsByProduct,
  createReview,
  updateReview,
  toggleReviewVisibility,
  deleteReview,
  getAllReviews
};