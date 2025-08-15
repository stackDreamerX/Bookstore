const Contact = require("../models/ContactModel");

//tạo Contact
const createContact = (newContact) => {
    return new Promise(async (resolve, reject) => {
        const {
            contactCode,
            contactName,
            contactPhone,
            contactEmail,
            contactAddress,
            ContactImage,
            contactType,
            isActive,
        } = newContact;

        try {
            //check tên sản phẩm
            const checkContact = await Contact.findOne({
                name: ContactName,
            });
            //nếu name Contact đã tồn tại
            if (checkContact !== null) {
                resolve({
                    status: "OK",
                    message: "The name of Contact is already",
                });
            }

            const createdContact = await Contact.create({
                contactCode,
                contactName,
                contactPhone,
                contactEmail,
                contactAddress,
                ContactImage,
                contactType,
                isActive,
            });
            if (createdContact) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createdContact,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

//update Contact
const updateContact = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check name created
            const checkContact = await Contact.findOne({
                _id: id,
            });
            //console.log("checkUser", checkUser);

            //nếu Contact ko tồn tại
            if (checkContact === null) {
                resolve({
                    status: "OK",
                    message: "The Contact is not defined",
                });
            }

            const updatedContact = await Contact.findByIdAndUpdate(id, data, {
                new: true,
            });
            //console.log("updatedContact", updatedContact);
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatedContact,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//delete Contact
const deleteContact = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check Contact created
            const checkContact = await Contact.findOne({
                _id: id,
            });
            //console.log("checkContact", checkContact);

            //nếu Contact ko tồn tại
            if (checkContact === null) {
                resolve({
                    status: "OK",
                    message: "The Contact is not defined",
                });
            }

            await Contact.findByIdAndDelete(id);
            //console.log("updatedContact", updatedContact);
            resolve({
                status: "OK",
                message: "DELETE Contact IS SUCCESS",
            });
        } catch (e) {
            reject(e);
        }
    });
};

//get details Contact
const getDetailsContact = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email created
            const Contact = await Contact.findOne({
                _id: id,
            });

            //nếu Contact ko tồn tại
            if (Contact === null) {
                resolve({
                    status: "OK",
                    message: "The Contact is not defined",
                });
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: Contact,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//get all Contact
const getAllContact = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalContact = await Contact.countDocuments();

            if (filter) {
                const label = filter[0];
                const allContactFilter = await Contact.find({
                    [label]: { $regex: filter[1] },
                })
                    .limit(limit)
                    .skip(page * limit); //filter gần đúng
                resolve({
                    status: "OK",
                    message: "Get all Contact IS SUCCESS",
                    data: allContactFilter,
                    total: totalContact,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalContact / limit),
                });
            }

            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                //console.log('objectSort', objectSort)
                const allContactSort = await Contact.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort);
                resolve({
                    status: "OK",
                    message: "Get all Contact IS SUCCESS",
                    data: allContactSort,
                    total: totalContact,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalContact / limit),
                });
            }

            const allContact = await Contact.find()
                .limit(limit)
                .skip(page * limit);
            resolve({
                status: "OK",
                message: "Get all Contact IS SUCCESS",
                data: allContact,
                total: totalContact,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalContact / limit),
            });
        } catch (e) {
            reject(e);
        }
    });
};

//apply Contact
const applyContact = (orderId, ContactCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Contact = await Contact.findOne({ ContactCode });
            if (!Contact || !Contact.isActive) {
                resolve({
                    status: "OK",
                    message: "Contact is invalid or inactive",
                });
                return;
            }

            // Logic to apply Contact to order (có thể thêm vào logic tính toán Contact vào đơn hàng)
            resolve({
                status: "OK",
                message: "Contact applied successfully",
                data: Contact,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//validate Contact
const validateContact = (ContactCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Contact = await Contact.findOne({ ContactCode });
            if (!Contact || !Contact.isActive) {
                resolve({
                    status: "OK",
                    message: "Invalid or inactive Contact code",
                });
                return;
            }

            // Logic to validate Contact
            resolve({
                status: "OK",
                message: "Contact is valid",
                data: Contact,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//get user Contact
const getUserContacts = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Contacts = await Contact.find({ applicableCategory: userId }); // Giả sử lọc theo userId hoặc thông tin người dùng
            resolve({
                status: "OK",
                message: "User Contacts fetched successfully",
                data: Contacts,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//active Contact
const toggleContactStatus = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Contact = await Contact.findOne({ _id: id });
            if (!Contact) {
                resolve({
                    status: "OK",
                    message: "Contact not found",
                });
                return;
            }

            Contact.isActive = !Contact.isActive;
            await Contact.save();

            resolve({
                status: "OK",
                message: "Contact status toggled",
                data: Contact,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createContact,
    updateContact,
    deleteContact,
    getDetailsContact,
    getAllContact,
    applyContact,
    validateContact,
    getUserContacts,
    toggleContactStatus,
};
