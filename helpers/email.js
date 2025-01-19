

const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

const emailWithNodemailer = async (emailData) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USERNAME, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent %s", info.response);
        return { success: true };
    } catch (error) {
        console.error('Error sending mail', error);
        throw error;
    }
};

const generateOneTimeCode = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
};

const prepareEmailData = (email, name, oneTimeCode) => {
    return {
        email,
        subject: 'Account Activation Email',
        html: `
        <div style="background-color: #87CEEB; color: #ffffff; padding: 20px; font-family: Arial, sans-serif; text-align: center; min-height: 100vh;">
            <div style="background-color: #4682B4; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
                <h1 style="font-size: 2.5em; margin-bottom: 10px;">Hello, ${name}</h1>
                <p style="font-size: 1.2em; margin-bottom: 20px;">Your One-Time Code is:</p>
                <h3 style="font-size: 2em; color: #FFD700; margin-bottom: 20px;">${oneTimeCode}</h3>
                <p style="font-size: 1em; margin-bottom: 20px;">This Code is valid for 3 minutes.</p>
                <hr style="border: 1px solid #ffffff; margin: 20px 0;">
                <small style="font-size: 0.9em;">If you didn't request this, please ignore this email.</small>
            </div>
        </div>
        `
    };
};


const sendActivationEmail = async (email, name) => {
    const oneTimeCode = generateOneTimeCode();
    console.log(oneTimeCode,"-------------------send email")
    const emailData = prepareEmailData(email, name, oneTimeCode);

    const result = await emailWithNodemailer(emailData);
    // await user.save();

    if (result.success) {
        return { success: true, message: "Thanks! Please check your E-mail to verify.", oneTimeCode };
        // await user.save();

    } else {
        return { success: false, error: result.error };
    }
};

module.exports = sendActivationEmail;
