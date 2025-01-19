




// sign up controller of the golf app server 
//-----------------************************
// const signUpService = async ({ name, email, password, phone, role ,city,state,country,handicap}) => {
//     // Check if the user already exists
//     const userExist = await User.findOne({ email: email });
//     if (userExist) {
//         return {
//             success: false,
//             statusCode: 409,
//             message: 'User Already Exist',
//             type: 'Auth',
//         };
//     }

const sendActivationEmail = require("../../../../helpers/email");
const User = require("../user/user.models");

//     // Send activation email
//     const emailResult = await sendActivationEmail(email, name);

//     if (!emailResult.success) {
//         return {
//             success: false,
//             statusCode: 500,
//             message: 'Error sending activation email',
//             type: 'Email',
//             error: emailResult.error,
//         };
//     }

//     // Create a new user instance and save it to the database
//     const oneTimeCode = emailResult.oneTimeCode;
//     const newUser = new User({ name, email, password, phone, oneTimeCode, role,city,state,country,handicap });
//     const savedUser = await newUser.save();

//     // Schedule oneTimeCode cleanup
//     setTimeout(async () => {
//         try {
//             savedUser.oneTimeCode = null;
//             await savedUser.save();
//             console.log('oneTimeCode reset to null after 3 minutes');
//         } catch (error) {
//             console.error('Error updating oneTimeCode:', error);
//         }
//     }, 180000); // 3 minutes in milliseconds

//     return {
//         success: true,
//         statusCode: 200,
//         message: emailResult,
//         data: savedUser,
//         type: role,
//     };
// };

const signUpService = async ({ name, email, password, phone, role, city, state, country, handicap }) => {
    // Check if the user already exists
    const userExist = await User.findOne({ email: email });
    if (userExist) {
        return {
            status:"confilect",
            success: false,
            statusCode: 409,
            message: 'User Already Exist',
            type: 'Auth',
        };
    }

    // Create a new user instance
    const newUser = new User({ name, email, password, phone, role, city, state, country, handicap });
    const emailPromise = sendActivationEmail(email, name);

    // Save user to the database
    const savedUser = await newUser.save();

    // Wait for email to be sent
    const emailResult = await emailPromise;

    if (!emailResult.success) {
        return {
            success: false,
            status:"error",
            statusCode: 500,
            message: 'Error sending activation email',
            type: 'Email',
            error: emailResult.error,
        };
    }

    // Schedule oneTimeCode cleanup
    const oneTimeCode = emailResult.oneTimeCode;
    savedUser.oneTimeCode = oneTimeCode;
    await savedUser.save(); // Save oneTimeCode

    setTimeout(async () => {
        try {
            savedUser.oneTimeCode = null;
            await savedUser.save();
        } catch (error) {
            console.error('Error updating oneTimeCode:', error);
        }
    }, 180000); // 3 minutes in milliseconds

    return {
        success: true,
        statusCode: 200,
        status:"success",
        message: emailResult,
        data: savedUser,
        type: role,
    };
};

// verify otp up services of the golf app server 
//-----------------************************


const verifyOtpService = async ({ email, code }) => {
    const user = await User.findOne({ email: email });

    // Check if user exists
    if (!user) {
        return {
            success: false,
            statusCode: 404,
            status:"error",

            message: "User not found",
            type: "User",
        };
    }

    // Check if the provided code matches the user's one-time code
    if (user.oneTimeCode !== code) {
        return {
            success: false,
            status:"code error",

            statusCode: 400,
            message: "Incorrect verification code",
            type: "Validation",
        };
    }

    // If verification is successful
    return {
        success: true,
        status:"success",
        statusCode: 200,
        message: "User verified successfully",
        data: user,
    };
};

module.exports = {
    signUpService,
    verifyOtpService
};
