const mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
        trim:true,
    },
    description:{
        type:String,
        require:true,
    },
    category:{
        type:String,
        require:true,
    },
    numView:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisliked:{
        type:Boolean,
        default:false,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    images:{
        type:String,
    },
    author:{
        type:String,
        default:"admin"
    }
},{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true
})

module.exports = mongoose.model("Blog",blogSchema)