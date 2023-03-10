const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const fs = require("fs");
require("dotenv").config();

module.exports = {
  // ---------------------------- Generating access token ---------------------------//
  signInAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "10m",
        issuer: "Ghost Rider",
        audience: userId, // can also provide the api verification, like if is being used by the authorized api or not.
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log("Error signing access token",err);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  // ---------------------------- Verifying access token ----------------------------//
  verifyAccessToken: (req, res, next) => {
    const token = req?.cookies["unitProjectAccessToken"] || req.headers.authorization.split(" ")[1];
    const allTokens = JSON.parse(fs.readFileSync("./refreshTokens.json","utf-8"));
    const blacklistedToken = allTokens.filter((ele)=>ele.userId==token);
    if(blacklistedToken.length>0) return next(createError.Unauthorized());
    // console.log(blacklistedToken,"blacklisted",token);
    if (!token) return next(createError.Unauthorized());
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        // creating a correct message so that we don't provide the Exact issue that happened to avoid malicious use of that token.

        const message =
          err.message === "JsonWebTokenError" ? "Unauthorized" : err.message;
          return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
  // ---------------------------- Generate refresh token ----------------------------//
  generateRefreshToken: (userId)=> {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn:"1h",
            issuer :"Ghost Rider",
            audience:userId
        };
        jwt.sign(payload, secret, options, (err,token)=>{
            if(err){
                reject(createError.InternalServerError());
            }
            resolve(token);
        })
    })
  },
  // ---------------------------- Verifying refresh token ---------------------------//
  verifyRefreshToken: (refreshToken)=>{
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,payload)=>{
            if(err){
                const message = err.message==="JsonWebTokenError"?"Unauthorized":err.message;
                reject(createError.Unauthorized(message));
            }
            const userId = payload.aud;
            // Use redis to apply token blacklisting
            resolve(userId);
        })
    });
  },
};
