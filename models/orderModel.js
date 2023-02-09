const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            count:Number,
            color:String,
        },
    ],
   paymentIntent:{},
   orderStatus:{
        type:String,
        default:"Not Processed",
        emun:[
            "Not Processed",
            "Cash on Delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered"
        ]
    },
    orderby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    
    timestamps:true
})

module.exports = mongoose.model("Order",orderSchema)