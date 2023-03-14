const nodemailer = require("nodemailer");

// reusable transporter object using the defalut SMTP transport

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = { transporter };

// async function main() {
//   // generate a test SMTP service account for ethreal.email
//   // only needed if you don't have an real email account for testing
//   let testaccount = await nodemailer.createTestAccount();

//   // create a reusable transporter object using the default SMTP transport

//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethreal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testaccount.user, // generate ethereal user
//       pass: testaccount.password, // generate ethereal password
//     },
//   });

//   // send email with defined transport object

//   let info = await transporter.sendMail({
//     from: '"Fred Foo"<foo@example.com"', // sender address
//     to: "bar@example.com,baz@example.com", // list of receivers
//     subject: "Hello",
//     text: "Hello from world",
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent to: %s", info.messageId);

//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// }
// main().catch(console.error());
