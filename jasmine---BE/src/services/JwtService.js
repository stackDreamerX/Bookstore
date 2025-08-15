const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generalAccessToken = (payload) => {
  try {
    console.log("Payload for access token:", payload);
    const access_token = jwt.sign({ ...payload }, process.env.ACCESS_TOKEN, {
      expiresIn: "24h",

    });
    return access_token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new Error("Failed to generate access token");
  }
};

const generalRefreshToken = (payload) => {
  try {
    // console.log("Payload for refresh token:", payload);
    const refresh_token = jwt.sign({ ...payload }, process.env.REFRESH_TOKEN, {
      expiresIn: "365d",
    });
    return refresh_token;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new Error("Failed to generate refresh token");
  }
};
//tạo access token mới dựa vào refresh token
const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          // console.error("Error verifying refresh token:", err);
          return resolve({
            status: "ERROR",
            message: "The authentication failed",
          });
        }

        // console.log("Payload from refresh token:", payload);

        try {
          const access_token = generalAccessToken({
            id: user?.id,
            isAdmin: user?.isAdmin,
          });

          resolve({
            status: "OK",
            message: "SUCCESS",
            access_token,
          });
        } catch (tokenError) {
          console.error("Error generating new access token:", tokenError);
          resolve({
            status: "ERROR",
            message: "Failed to generate access token",
          });
        }
      });
    } catch (e) {
      console.error("Unexpected error in refreshTokenJwtService:", e);
      reject(e);
    }
  });
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshTokenJwtService,
};
