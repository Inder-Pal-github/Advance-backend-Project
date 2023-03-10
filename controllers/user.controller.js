const { User } = require("../models/user.model");
const createError = require("http-errors");
const fs = require("fs");
const {
  signInAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt.helpers");

module.exports = {
  registerUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userExist = await User.findOne({ email });
      if (userExist) {
        throw createError.Conflict(`${email} is already been registered.`);
      } else {
        const user = new User({ ...req.body });
        const savedUser = await user.save();
        // const accessToken = await signInAccessToken(savedUser.id);
        // const refreshToken = await generateRefreshToken(savedUser.id);
        res.send({ user: savedUser,msg:"User registered, please login."});
      }
    } catch (error) {
      next(error);
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) throw createError.NotFound("User not registered");
      const isMatch = await user.isValidPassword(password);
      if (!isMatch) throw createError.Unauthorized("Invalid credentials.");
      const accessToken = await signInAccessToken(user.id);
      const refreshToken = await generateRefreshToken(user.id);
      res.cookie("unitProjectAccessToken",accessToken);
      res.cookie("unitProjectRefreshToken",refreshToken);
      res.send({ msg:"Login successful."});
    } catch (error) {
      next(error);
    }
  },
  refresh_token: async (req, res, next) => {
    try {
      const refreshToken = req?.cookies["unitProjectRefreshToken"] || req?.headers?.authorization.split(" ")[1];
      
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);

      const newAccessToken = await signInAccessToken(userId);
      const newRefreshToken = await generateRefreshToken(userId);

      res.cookie("unitProjectAccessToken",newAccessToken);
      res.cookie("unitProjectRefreshToken",newRefreshToken);

      // res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const  refreshToken  = req?.cookies["unitProjectRefreshToken"] || req?.headers?.authorization.split(" ")[1];
      const  accessToken  = req?.cookies["unitProjectAccessToken"] || req?.headers?.authorization.split(" ")[1];
      if (!refreshToken||!accessToken) throw createError.BadRequest();
      // const userId = await verifyRefreshToken(refreshToken);
      let allTokens = JSON.parse(fs.readFileSync("./refreshTokens.json","utf-8"));
      allTokens = [...allTokens,{userId:refreshToken},{userId:accessToken}];
      fs.writeFileSync("./refreshTokens.json",JSON.stringify(allTokens))
      // let alltokens = JSON.parse(
      //   fs.readFileSync("./refreshTokens.json", "utf-8")
      // );
      // alltokens = alltokens.filter((ele) => ele.userId !== refreshToken);
      // fs.writeFileSync("./refreshTokens.json", JSON.stringify(alltokens));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};
