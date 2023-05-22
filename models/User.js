const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const UserSchema=new Schema({

    title: {
        type: String
    },
    
    publishedAt: {
        type: Date,
        default: Date.now
    },
    value: {
        type: Number
    },
});

module.exports=mongoose.model("user", UserSchema);