const {Router} = require("express");
const { registerUser, loginUser, logout, refresh_token } = require("../controllers/user.controller");

const userRouter = Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/logout",logout);
userRouter.get("/refresh-token",refresh_token);

module.exports = {userRouter};