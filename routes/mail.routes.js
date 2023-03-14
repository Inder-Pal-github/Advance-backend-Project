const {Router} = require("express");
const { SendMail } = require("../controllers/mail.controller");

const mailRouter = Router();

mailRouter.get("/send-email",SendMail);

module.exports = {mailRouter};