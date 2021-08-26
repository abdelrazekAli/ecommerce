const randomString = require("randomstring");
const nodemailer = require("nodemailer");

exports.getUserCode = () => {
  return randomString.generate(15);
};

exports.sendMail = async (msg, mailTo) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, //Your gmail account
      pass: process.env.PASS, //Your gmail password
    },
  });

  let mailOptions = {
    from: "Ecommerce store", // sender address
    to: mailTo, // list of receivers
    subject: "Account Activation",
    text: "",
    html: `<div>${msg}</div>`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) return console.log("Error : ", err);
    return console.log("Email sent ...");
  });
};
