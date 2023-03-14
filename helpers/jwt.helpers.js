const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const fs = require("fs");
const { redisClient } = require("./redis");
require("dotenv").config();

module.exports = {
  // ---------------------------- Generating access token ---------------------------//
  signInAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = { userId };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "30s",
        issuer: "Ghost Rider",
        audience: userId, // can also provide the api verification, like if is being used by the authorized api or not.
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log("Error signing access token", err);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  // ---------------------------- Verifying access token ----------------------------//
  verifyAccessToken: (req, res, next) => {
    const accessToken =
      req?.cookies["unitProjectAccessToken"] ||
      req.headers.authorization.split(" ")[1];
    const refreshToken =
      req?.cookies["unitProjectRefreshToken"] ||
      req.headers?.authorization.split(" ")[2];

    if (!accessToken) return next(createError.Unauthorized());
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        // creating a correct message so that we don't provide the Exact issue that happened to avoid malicious use of that token.

        const message =
          err.message === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      // check if token provided is blacklisted or not;
      const userId = payload.userId;
      redisClient
        .get(userId)
        .then((data) => {
          if (data !== null) {
            const parsedData = JSON.parse(data);
            console.log(parsedData.length);
            if (
              parsedData.includes(accessToken) ||
              parsedData.includes(refreshToken)
            ) {
              console.log(data, "data");
              return res.send({ msg: "Please login again!!!" });
            }
          }
          console.log("Data", data);
          req.payload = payload;
          next();
        })
        .catch((error) => {
          console.log(error.message);
          if (error)
            return res.status(400).send({ msg: "Something went wrong" });
        });
    });
  },
  // ---------------------------- Generate refresh token ----------------------------//
  generateRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1m",
        issuer: "Ghost Rider",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  // ---------------------------- Verifying refresh token ---------------------------//
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            const message =
              err.message === "JsonWebTokenError"
                ? "Unauthorized"
                : err.message;
            reject(createError.Unauthorized(message));
          }
          const userId = payload.aud;
          // Use redis to apply token blacklisting
          resolve(userId);
        }
      );
    });
  },
};
