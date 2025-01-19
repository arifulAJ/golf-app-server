const sendActivationEmail = require("../../../../helpers/email");
const { createJSONWebToken } = require("../../../../helpers/jsonwebtoken");
const User = require("../user/user.models");
const bcrypt = require('bcryptjs');

// sign  up services of the golf app server 
//-----------------************************

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
    if (user.oneTimeCode === null) {
        return {
            success: false,
            status:"code error",

            statusCode: 400,
            message: "your otp is null re-send otp ",
            type: "Validation",
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
       // If code is correct, mark user as verified and clear one-time code
       user.isVerified = true;
       user.oneTimeCode = null;
       await user.save(); // Remember to await save()
         // Generate JWT token for the user
         const expiresInOneYear = 365 * 24 * 60 * 60; // seconds in 1 year
         const accessToken = createJSONWebToken({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, expiresInOneYear);
      

    // If verification is successful
    return {
        success: true,
        status:"success",
        statusCode: 200,
        message: "User verified successfully",
        data: accessToken,
    };
};

// resend  otp up services of the golf app server 
//-----------------************************

const resendOtpServices=async({email})=>{

    const findUser=await User.findOne({email})
    
    if(!findUser){
        return {
            success: false,
            statusCode: 404,
            status:"error",

            message: "User not found",
            
        };
    }

    if(findUser.oneTimeCode===null){

        const sendOtp=await sendActivationEmail(email,findUser.name)

        findUser.oneTimeCode= sendOtp.oneTimeCode
       

        await findUser.save()
       


        return{
            success:true,
            statusCode:200,
            status:"success",
            message:"send otp to you email "
        }
    }

    return{
        success:true,
        statusCode:400,
        status:"error",
        message:"you have oneTimeCode pleace check the email"
    }


}

// resend  otp up services of the golf app server 
//-----------------************************
const signInServices=async({email,password})=>{
    const user=await User.findOne({email})

    if(!user){
        return{
            success:false,
            status:"error",
            statusCode:404,
            message:"user not found",

        }
    }
    if(!email || !password){
        return{
            success:false,
            status:"error",
            statusCode:404,
            message:"email and password is required",

        }
    }

    if(user.isBlocked){
        return{
            success:false,
            status:"error",
            statusCode:400,
            message:"you are blocked",

        }
    }
    if(!user.isVerified){
        return{
            success:false,
            status:"error",
            statusCode:400,
            message:"you are not verifyed user",

        }
    }

    // Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log("---------------", isPasswordValid)
            if (!isPasswordValid) {
                return{
                    success:false,
                    status:"error",
                    statusCode:400,
                    message:"you entered invalid password",
        
                }
             }

             const expiresInOneYear = 365 * 24 * 60 * 60; // seconds in 1 year
             const accessToken = createJSONWebToken({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, expiresInOneYear);
           
            // Update the user's isLoggedIn status to true
                await user.updateOne({ _id: user._id }, { isLoggedIn: true });

            return{
                success:true,
                status:"success",
                statusCode:200,
                message:"sing-in successfully",
                data:accessToken
            }
}
module.exports = {
    signUpService,
    verifyOtpService,
    resendOtpServices,
    signInServices
};
