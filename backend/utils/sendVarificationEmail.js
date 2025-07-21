const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
// //?Load dtonev into process
dotenv.config();
const sendVarificationEmail = async (to, varificationToken) => {
    try {
        //create transport
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
               user: process.env.GMAIL_USER, //senders email address,
                pass: process.env.APP_PWD,
            },
        });
        //create msg
        const message = {
            to,
            subject: "Password reset",
            html: `
        <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p>https://localhost:5000/api/v1/users/verify-account/${varificationToken}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `,
        };
        //send the email
        const info = await transporter.sendMail(message);
        console.log("Email sent", info.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Email sending failed");
    }
};

module.exports = sendVarificationEmail;