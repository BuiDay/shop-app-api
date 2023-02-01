const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    mobile:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        default:"user"
    },
    cart:{
        type:Array,
        default:[]
    },

    isBlock:{
        type:Boolean,
        default:false,
    },
    address:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Address",
        }
    ],
    wishlist:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        }
    ],
    refreshToken:{
        type:String,
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
},
{
    timestamps:true
}
)

// userSchema.pre("save",async function(next){
//     const salt = await bcrypt.genSaltSync(10);
//     this.password = await bcrypt.hash(this.password, salt)
// })

// userSchema.methods.isPasswordMatched = async function(enterPassword){
//     return await bcrypt.compareSync(enterPassword, this.password)
// }

module.exports = mongoose.model("User",userSchema)