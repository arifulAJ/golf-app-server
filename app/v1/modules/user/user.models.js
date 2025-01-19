// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: [true, "Name is required"], minlength: 1, maxlength: 300, },
//     email: {
//         type: String, required: [true, "Email is required"], minlength: 3, maxlength: 100, trim: true,
//         unique: [true, 'Email should be unique'],
//         lowercase: true,
//         validate: {
//             validator: function (v) {
//                 return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
//             },
//             message: 'Please enter a valid Email'
//         }
//     },
//     role: { type: String, required: true, enum: ["user", "superUser",], default: "user" },
//     password: {
//         type: String,
//         required: false,
      
//       },
//     phone: { type: String, required: false ,default:"0124544"},
//     address:{type:String,required:false,default:null},
//     dateOfBirth:{type:String,require:false,default:null},
//     // rating:{type:String,require:false,default:"0.00"},
//    city:{type:String,required:true},
//    state:{type:String,required:true},
//    country:{type:String,required:true},
//    handicap:{type:String,required:true},
//     myLocation: {
//         type: {
//             type: String, // This will always be 'Point' for GeoJSON data
//             enum: ['Point'], // Only allow 'Point' as type
//             required: false,
//             default: 'Point'
//         },
//         coordinates: {
//             type: [Number], // Array of numbers: [longitude, latitude]
//             required: false,
//             default: [0, 0], // Default to [longitude, latitude]
//         }
//     },
//     currentLocation: {
//         type: {
//             type: String, // This will always be 'Point' for GeoJSON data
//             enum: ['Point'], // Only allow 'Point' as type
//             required: false,
//             default: 'Point'
//         },
//         coordinates: {
//             type: [Number], // Array of numbers: [longitude, latitude]
//             required: false,
//             default: [0, 0], // Default to [longitude, latitude]
//         }
//     },
   

//     privacyPolicyAccepted: { type: Boolean, default: false, required: false },
   

//     isAdmin: { type: Boolean, default: false },
//     isVerified: { type: Boolean, default: false },
//     isDeleted: { type: Boolean, default: false },
//     isBlocked: { type: Boolean, default: false },
//     image: { type: Object, required: false, default: { publicFileUrl: "/images/users/user.png", path: "public\\images\\users\\user.png" } },
//     fcmToken:{type:String,required:false},
   
//     oneTimeCode: { type: String, required: false, default: null },
// },{ timestamps: true },
//  {
//     toJSON: {
//         transform(doc, ret) {
//             delete ret.password;
//         },
//     },
// },
    
// );

// // Add a geospatial index for location
// userSchema.index({ currentLocation: "2dsphere",myLocation:"2dsphere" });

// userSchema.methods.isPasswordMatch = async function (password) {
//     const user = this;
//     return bcrypt.compare(password, user.password);
//   };
  
//   userSchema.pre("save", async function (next) {
//     const user = this;
//     if (user.isModified("password")) {
//       user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
//   });
// module.exports = mongoose.model('User', userSchema);



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Utility for email validation
const validateEmail = (email) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 1,
      maxlength: 300,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
      validate: {
        validator: validateEmail,
        message: "Please enter a valid Email",
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "superUser"],
      default: "user",
    },
    password: {
      type: String,
      required: false,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    phone: { type: String, required: false, default: "0124544" },
    address: { type: String, required: false, default: null },
    dateOfBirth: { type: String, required: false, default: null },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    handicap: { type: String, required: true },
    clubName:{type:String,required:false,default:""},
    facebookLink:{type:String,required:false,default:""},
    instagramLink:{type:String,required:false,default:""},
    linkdinLink:{type:String,required:false,default:""},
    xLink:{type:String,required:false,default:""},
    myLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false,
        default: [0, 0]      },
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false,
        default: [0, 0]      },
    },
    privacyPolicyAccepted: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    image: {
      type: Object,
      required: false,
      default: {
        publicFileUrl: "/images/users/user.png",
        path: "public\\images\\users\\user.png",
      },
    },
    fcmToken: { type: String, required: false },
    oneTimeCode: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
                transform(doc, ret) {
                    delete ret.password;
                },
            },
  }
);

// Add geospatial indexes
userSchema.index({ currentLocation: "2dsphere", myLocation: "2dsphere" });

// Compare passwords
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Hash passwords before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
