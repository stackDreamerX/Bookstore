const Discount = require("../models/DiscountModel");

// Tạo Discount
const createDiscount = (newDiscount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        discountCode,
        discountName,
        discountValue,
        applicableCategory,
        discountImage,
        discountStartDate,
        discountEndDate,
      } = newDiscount;

      // Check for duplicate productCode or productName
      const checkDiscount = await Discount.findOne({
        $or: [ { discountName }],
      });

      if (checkDiscount) {
        return resolve({
          status: "ERR",
          message: "Product name already exists.",
        });
      }

      const createdDiscount = await Discount.create(newDiscount);

      resolve({
        status: "OK",
        message: "Product created successfully",
        data: createdDiscount,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to create product",
      });
    }
  });
};



//update Discount
const updateDiscount = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check name created
      const checkDiscount = await Discount.findOne({
        _id: id,
      });
      //console.log("checkUser", checkUser);

      //nếu Discount ko tồn tại
      if (checkDiscount === null) {
        resolve({
          status: "OK",
          message: "The Discount is not defined",
        });
      }

      const updatedDiscount = await Discount.findByIdAndUpdate(id, data, {
        new: true,
      });
      //console.log("updatedDiscount", updatedDiscount);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedDiscount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//delete Discount
const deleteDiscount = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check Discount created
      const checkDiscount = await Discount.findOne({
        _id: id,
      });
      //console.log("checkDiscount", checkDiscount);

      //nếu Discount ko tồn tại
      if (checkDiscount === null) {
        resolve({
          status: "OK",
          message: "The Discount is not defined",
        });
      }

      await Discount.findByIdAndDelete(id);
      //console.log("updatedDiscount", updatedDiscount);
      resolve({
        status: "OK",
        message: "DELETE Discount IS SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

//get details Discount
const getDetailsDiscount = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email created
      const Discount = await Discount.findOne({
        _id: id,
      });

      //nếu Discount ko tồn tại
      if (Discount === null) {
        resolve({
          status: "OK",
          message: "The Discount is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: Discount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDiscount = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {};

      // Add filtering condition
      if (filter) {
        const [field, value] = filter;
        query[field] = { $regex: value, $options: "i" }; // Case-insensitive partial match
      }

      const totalDiscount = await Discount.countDocuments(query);

      // Add sorting condition
      const sortCondition = sort ? { [sort[1]]: sort[0] } : {};

      const allDiscount = await Discount.find(query)
        .limit(limit)
        .skip(page * limit)
        .sort(sortCondition);

      resolve({
        status: "OK",
        message: "Products retrieved successfully",
        data: allDiscount,
        total: totalDiscount,
        pageCurrent: Number(page) + 1,
        totalPage: Math.ceil(totalDiscount / limit),
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to get products",
      });
    }
  });
};

//apply discount
const applyDiscount = (orderId, discountCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discount = await Discount.findOne({ discountCode });
      if (!discount || !discount.isActive) {
        resolve({
          status: "OK",
          message: "Discount is invalid or inactive",
        });
        return;
      }

      // Logic to apply discount to order (có thể thêm vào logic tính toán discount vào đơn hàng)
      resolve({
        status: "OK",
        message: "Discount applied successfully",
        data: discount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//validate discount
const validateDiscount = (discountCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discount = await Discount.findOne({ discountCode });
      if (!discount || !discount.isActive) {
        resolve({
          status: "OK",
          message: "Invalid or inactive discount code",
        });
        return;
      }

      // Logic to validate discount
      resolve({
        status: "OK",
        message: "Discount is valid",
        data: discount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//get user discount
const getUserDiscounts = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discounts = await Discount.find({ applicableCategory: userId }); // Giả sử lọc theo userId hoặc thông tin người dùng
      resolve({
        status: "OK",
        message: "User discounts fetched successfully",
        data: discounts,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//active discount
const toggleDiscountStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discount = await Discount.findOne({ _id: id });
      if (!discount) {
        resolve({
          status: "OK",
          message: "Discount not found",
        });
        return;
      }

      discount.isActive = !discount.isActive;
      await discount.save();

      resolve({
        status: "OK",
        message: "Discount status toggled",
        data: discount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDetailsDiscount,
  getAllDiscount,
  applyDiscount,
  validateDiscount,
  getUserDiscounts,
  toggleDiscountStatus,
};
