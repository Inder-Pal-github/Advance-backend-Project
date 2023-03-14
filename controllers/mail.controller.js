
const { transporter } = require("../helpers/mail");

const SendMail = (req, res) => {
  // setup email data
  let mailOpitons = {
    from: "inder@gmail.com",
    to: req.body.email,
    subject: "OTP",
    text: `Your one time password is 123456`,
  };
  // send mail
  transporter.sendMail(mailOpitons, (error, info) => {
    if (error) {
      console.log(error);
      res.send({ msg: "Error sending email" });
    } else {
      console.log("Email send", info.response);
      res.send({ msg: "Email sent successfully" });
    }
  });
};
module.exports = { SendMail };
