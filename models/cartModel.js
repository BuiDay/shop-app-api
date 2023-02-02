const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            count:Number,
            color:String,
            price:Number,
        },
    ],
    cartTotal:Number,
    totalAfterDiscount:Number,
    orderby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},{
    
    timestamps:true
})

module.exports = mongoose.model("Cart",cartSchema)