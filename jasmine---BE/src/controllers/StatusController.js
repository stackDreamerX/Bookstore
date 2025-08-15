const StatusService = require("../services/StatusService");

//create Status
const createStatus = async (req, res) => {
  try {
    //test input data
    const { statusCode, statusName } = req.body;
    //console.log("req.body", req.body);

    if (!statusName) {
      //check have
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await StatusService.createStatus(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//update Status
const updateStatus = async (req, res) => {
  try {
    const StatusId = req.params.id;
    const data = req.body;
    if (!StatusId) {
      return res.status(200).json({
        status: "ERR",
        message: "The StatusId is required",
      });
    }

    const response = await StatusService.updateStatus(StatusId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//delete Status
const deleteStatus = async (req, res) => {
  try {
    const statusId = req.params.id;
    //const token = req.headers;
    // console.log("statusId", statusId);

    if (!statusId) {
      return res.status(200).json({
        status: "ERR",
        message: "The StatusId is required",
      });
    }

    const response = await StatusService.deleteStatus(statusId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsStatus = async (req, res) => {
  try {
    const statusId = req.params.id;

    console.log("statusId", statusId);

    if (!statusId) {
      return res.status(400).json({
        status: "ERR",
        message: "The StatusId is required",
      });
    }

    const response = await StatusService.getDetailsStatus(statusId);
    if (!response) {
      return res.status(404).json({
        status: "ERR",
        message: "Status not found",
      });
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};
//get all Status
const getAllStatus = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await StatusService.getAllStatus(
      Number(limit) || 8,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  console.log("req.cookies", req.cookies);
  console.log("req.cookies.refresh_token", req.cookies.refresh_token);

  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }

    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createStatus,
  updateStatus,
  deleteStatus,
  getDetailsStatus,
  getAllStatus,
  refreshToken,
};
