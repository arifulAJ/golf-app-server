// sign up controller of the golf app server 

const Response = require("../../../../helpers/respones");
const { signUpService, verifyOtpService, resendOtpServices, signInServices } = require("./auth.services");



// sign up controller of the golf app server 
//-----------------************************
const signUp = async (req, res, next) => {
    try {
        const { name, email, password, phone, role,city,state,country,handicap } = req.body;

        // Call the service layer for signup logic
        const result = await signUpService({ name, email, password, phone, role ,city,state,country,handicap});

        // Return appropriate response based on the result
        if (!result.success) {
            return res.status(result.statusCode).json(Response(result));
        }

        return res.status(result.statusCode).json(Response(result));
    } catch (error) {
        next(error); // Pass error to centralized error handler
    }
};

// verify otp up controller of the golf app server 
//-----------------************************

const verifyOtp = async (req, res, next) => {
    try {
        const { code, email } = req.body;

        // Check if email or code is missing
        if (!email || !code) {
            return res.status(400).json(Response({
                message: "Email and code are required",
                status: "Bad Request",
                statusCode: 400,
                type: "Validation",
            }));
        }

        // Call the service layer
        const result = await verifyOtpService({ code, email });

        // Handle the service response
        if (!result.success) {
            return res.status(result.statusCode).json(Response(result));
        }

        // Respond with success message
        return res.status(result.statusCode).json(Response(result));
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

// resend  otp up controller of the golf app server 
//-----------------************************

const resendOtp=async(req,res,next)=>{
    try {
        const {email}=req.body

        const result=await resendOtpServices({email})


      // Handle the service response
      if (!result.success) {
        return res.status(result.statusCode).json(Response(result));
    }

    // Respond with success message
    return res.status(result.statusCode).json(Response(result));

    } catch (error) {
        next(error)
    }
}

// signin controller of the golf app server 
//-----------------************************

const signIn=async(req,res,next)=>{
    try {

        const {email,password}=req.body 

        const result=await signInServices({email,password})

           // Handle the service response
      if (!result.success) {
        return res.status(result.statusCode).json(Response(result));
    }

    // Respond with success message
    return res.status(result.statusCode).json(Response(result));

        
    } catch (error) {
        next(error)
    }
}


module.exports={
    signUp,
    verifyOtp,
    resendOtp,
    signIn
}