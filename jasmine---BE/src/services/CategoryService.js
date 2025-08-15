const Category = require("../models/CategoryModel");
const mongoose = require("mongoose");

/**
 * Create a new Category
 */
const createCategory = async (newCategory) => {
  try {
    const { categoryCode, categoryName } = newCategory;

    // Check for duplicate CategoryCode or CategoryName
    const checkDuplicateCategory = await Category.findOne({
      $or: [{ categoryCode }, { categoryName }],
    });

    if (checkDuplicateCategory) {
      throw new Error("Category code or name already exists");
    }

    const createdCategory = await Category.create(newCategory);

    return {
      status: "OK",
      message: "Category created successfully",
      data: createdCategory,
    };
  } catch (e) {
    throw {
      status: "ERR",
      message: e.message || "Failed to create Category",
    };
  }
};

/**
 * Update an existing Category
 */
const updateCategory = async (id, data) => {
  try {
    // Check if Category exists
    const checkCategory = await Category.findById(id);

    if (!checkCategory) {
      return {
        status: "ERR",
        message: "Category not found",
      };
    }

    // Check for duplicate CategoryName (excluding the current Category)
    const duplicateCategory = await Category.findOne({
      categoryName: data.categoryName,
      _id: { $ne: id },
    });

    if (duplicateCategory) {
      return {
        status: "ERR",
        message: "Category name already exists",
      };
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
    });

    return {
      status: "OK",
      message: "Category updated successfully",
      data: updatedCategory,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Failed to update Category",
    };
  }
};

/**
 * Delete a Category
 */
const deleteCategory = async (id) => {
  try {
    const checkCategory = await Category.findById(id);

    if (!checkCategory) {
      return {
        status: "ERR",
        message: "Category not found",
      };
    }

    await Category.findByIdAndDelete(id);

    return {
      status: "OK",
      message: "Category deleted successfully",
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Failed to delete Category",
    };
  }
};

/**
 * Get details of a single Category
 */
const getDetailsCategory = async (id) => {
  try {
    const Category = await Category.findById(id).populate("CategoryCategory");

    if (!Category) {
      return {
        status: "ERR",
        message: "Category not found",
      };
    }

    return {
      status: "OK",
      message: "Category retrieved successfully",
      data: Category,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Failed to get Category details",
    };
  }
};

/**
 * Get all Categories with pagination, filtering, and sorting
 */
const getAllCategory = async (limit, page, sort, filter) => {
  try {
    const query = {};

    // Add filtering condition
    if (filter) {
      const [field, value] = filter;
      query[field] = { $regex: value, $options: "i" }; // Case-insensitive partial match
    }

    const totalCategory = await Category.countDocuments(query);

    // Add sorting condition
    const sortCondition = sort ? { [sort[1]]: sort[0] } : {};

    const allCategory = await Category.find(query)
      .limit(limit)
      .skip(page * limit)
      .sort(sortCondition);

    return {
      status: "OK",
      message: "Categories retrieved successfully",
      data: allCategory,
      total: totalCategory,
      pageCurrent: Number(page) + 1,
      totalPage: Math.ceil(totalCategory / limit),
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Failed to get Categories",
    };
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getDetailsCategory,
  getAllCategory,
};
