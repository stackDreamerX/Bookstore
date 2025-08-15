const productImage = require("../models/ProductImageModel");


//tạo productImage
const createproductImage = (newproductImage) => {
  return new Promise(async (resolve, reject) => {
    const { ProductImage } =
    newproductImage;

    try {
      //check tên productImage
      const checkproductImage = await productImage.findOne({
        name: ProductImage,
      });
      //nếu name productImage đã tồn tại
      if (checkproductImage !== null) {
        resolve({
          status: "OK",
          message: "The name of productImage is already",
        });
      }

      const createdproductImage = await productImage.create({
        ProductImage
      });
      if (createdproductImage) {
        resolve({
         status: "OK",
          message: "SUCCESS",
          data: createdproductImage,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//update productImage
const updateproductImage = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check name created
      const checkproductImage = await productImage.findOne({
        _id: id,
      });
      //console.log("checkUser", checkUser);

      //nếu productImage ko tồn tại
      if (checkproductImage === null) {
        resolve({
           status:"OK",
          message: "The productImage is not defined",
        });
      }

      const updatedproductImage = await productImage.findByIdAndUpdate(id, data, {
        new: true,
      });
      //console.log("updatedproductImage", updatedproductImage);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedproductImage,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//delete productImage
const deleteproductImage = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check productImage created
      const checkproductImage = await productImage.findOne({
        _id: id,
      });
      //console.log("checkproductImage", checkproductImage);

      //nếu productImage ko tồn tại
      if (checkproductImage === null) {
        resolve({
            status: "OK",
          message: "The productImage is not defined",
        });
      }

      await productImage.findByIdAndDelete(id);
      //console.log("updatedproductImage", updatedproductImage);
      resolve({
        status: "OK",
        message: "DELETE productImage IS SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// //get details productImage
// const getDetailsproductImage = (id) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       //check email created
//       const productImage = await productImage.findOne({
//         _id: id,
//       });

//       //nếu productImage ko tồn tại
//       if (productImage === null) {
//         resolve({
//           productImage: "OK",
//           message: "The productImage is not defined",
//         });
//       }

//       resolve({
//         productImage: "OK",
//         message: "SUCCESS",
//         data: productImage,
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

//get all productImage
const getAllproductImage = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalproductImage = await productImage.countDocuments();
      
      if(filter){
        const label = filter[0];
        const allproductImageFilter = await productImage.find({ [label]: {'$regex': filter[1] } }).limit(limit).skip(page * limit) //filter gần đúng
        resolve({
            status: "OK",
          message: "Get all productImage IS SUCCESS",
          data: allproductImageFilter,
          total: totalproductImage,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalproductImage / limit),
        });
      }

      if(sort){
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        //console.log('objectSort', objectSort)
        const allproductImageSort = await productImage.find().limit(limit).skip(page * limit).sort(objectSort);
        resolve({
          status:"OK",
          message: "Get all productImage IS SUCCESS",
          data: allproductImageSort,
          total: totalproductImage,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalproductImage / limit),
        });
      }

      const allproductImage = await productImage.find().limit(limit).skip(page * limit);
      resolve({
        status: "OK",
        message: "Get all productImage IS SUCCESS",
        data: allproductImage,
        total: totalproductImage,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalproductImage / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createproductImage,
  updateproductImage,
  deleteproductImage,
 // getDetailsproductImage,
  getAllproductImage,
};
