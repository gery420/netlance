const nodemailer = require("nodemailer");
require("dotenv").config();

const { ServerError } = require("./Errors");

const SendEmail = (options, next) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };
        transporter.sendMail(mailOptions, function (error, info){
            if (error) {
                console.log("Error sending email: ", error);
                return reject(new ServerError("Failed to send email"));
            }
            console.log("Email sent: " + info);
            resolve();
        })
    })
}
module.exports = SendEmail;
