const Introduce = require("../models/IntroduceModel");

//tạo Introduce
const createIntroduce = (newIntroduce) => {
  return new Promise(async (resolve, reject) => {
    const {
      introduceCode,
      introduceName,
      introduceTitle,
      introduceContent
    } = newIntroduce;

    try {
      //check tên sản phẩm
      const checkIntroduce = await Introduce.findOne({
        name: introduceName,
      });
      //nếu name Introduce đã tồn tại
      if (checkIntroduce !== null) {
        resolve({
          status: "OK",
          message: "The name of Introduce is already",
        });
      }

      const createdIntroduce = await Introduce.create({
       
      introduceCode,
      introduceName,
      introduceTitle,
      introduceContent
      });
      if (createdIntroduce) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdIntroduce,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//update Introduce
const updateIntroduce = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check name created
      const checkIntroduce = await Introduce.findOne({
        _id: id,
      });
      //console.log("checkUser", checkUser);

      //nếu Introduce ko tồn tại
      if (checkIntroduce === null) {
        resolve({
          status: "OK",
          message: "The Introduce is not defined",
        });
      }

      const updatedIntroduce = await Introduce.findByIdAndUpdate(id, data, {
        new: true,
      });
      //console.log("updatedIntroduce", updatedIntroduce);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedIntroduce,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//delete Introduce
const deleteIntroduce = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check Introduce created
      const checkIntroduce = await Introduce.findOne({
        _id: id,
      });
      //console.log("checkIntroduce", checkIntroduce);

      //nếu Introduce ko tồn tại
      if (checkIntroduce === null) {
        resolve({
          status: "OK",
          message: "The Introduce is not defined",
        });
      }

      await Introduce.findByIdAndDelete(id);
      //console.log("updatedIntroduce", updatedIntroduce);
      resolve({
        status: "OK",
        message: "DELETE Introduce IS SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

//get details Introduce
const getDetailsIntroduce = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email created
      const Introduce = await Introduce.findOne({
        _id: id,
      });

      //nếu Introduce ko tồn tại
      if (Introduce === null) {
        resolve({
          status: "OK",
          message: "The Introduce is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: Introduce,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//get all Introduce
const getAllIntroduce = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalIntroduce = await Introduce.countDocuments();

      if (filter) {
        const label = filter[0];
        const allIntroduceFilter = await Introduce.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit); //filter gần đúng
        resolve({
          status: "OK",
          message: "Get all Introduce IS SUCCESS",
          data: allIntroduceFilter,
          total: totalIntroduce,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalIntroduce / limit),
        });
      }

      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        //console.log('objectSort', objectSort)
        const allIntroduceSort = await Introduce.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        resolve({
          status: "OK",
          message: "Get all Introduce IS SUCCESS",
          data: allIntroduceSort,
          total: totalIntroduce,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalIntroduce / limit),
        });
      }

      const allIntroduce = await Introduce.find()
        .limit(limit)
        .skip(page * limit);
      resolve({
        status: "OK",
        message: "Get all Introduce IS SUCCESS",
        data: allIntroduce,
        total: totalIntroduce,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalIntroduce / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

//apply Introduce
const applyIntroduce = (orderId, IntroduceCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Introduce = await Introduce.findOne({ IntroduceCode });
      if (!Introduce || !Introduce.isActive) {
        resolve({
          status: "OK",
          message: "Introduce is invalid or inactive",
        });
        return;
      }

      // Logic to apply Introduce to order (có thể thêm vào logic tính toán Introduce vào đơn hàng)
      resolve({
        status: "OK",
        message: "Introduce applied successfully",
        data: Introduce,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//validate Introduce
const validateIntroduce = (IntroduceCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Introduce = await Introduce.findOne({ IntroduceCode });
      if (!Introduce || !Introduce.isActive) {
        resolve({
          status: "OK",
          message: "Invalid or inactive Introduce code",
        });
        return;
      }

      // Logic to validate Introduce
      resolve({
        status: "OK",
        message: "Introduce is valid",
        data: Introduce,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//get user Introduce
const getUserIntroduces = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Introduces = await Introduce.find({ applicableCategory: userId }); // Giả sử lọc theo userId hoặc thông tin người dùng
      resolve({
        status: "OK",
        message: "User Introduces fetched successfully",
        data: Introduces,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//active Introduce
const toggleIntroduceStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Introduce = await Introduce.findOne({ _id: id });
      if (!Introduce) {
        resolve({
          status: "OK",
          message: "Introduce not found",
        });
        return;
      }

      Introduce.isActive = !Introduce.isActive;
      await Introduce.save();

      resolve({
        status: "OK",
        message: "Introduce status toggled",
        data: Introduce,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createIntroduce,
  updateIntroduce,
  deleteIntroduce,
  getDetailsIntroduce,
  getAllIntroduce,
  applyIntroduce,
  validateIntroduce,
  getUserIntroduces,
  toggleIntroduceStatus,
};
