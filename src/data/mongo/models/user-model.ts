import mongoose from "mongoose";

const useSchema = new mongoose.Schema({

name:{
    type:String,
    required:[true,"Name is required"]
},

email:{
    type:String,
    required:[true,"Email is required"],
    unique:true
},

emailValidated:{
    type:Boolean,
    default:false
},

password:{
    type:String,
    required:[true,"Password is required"]
},

img:{
    type:String
},

role:{
    type:[String],
    default:["USER_ROLE"],
    enum:["ADMIN_ROLE","USER_ROLE"]
}

});


useSchema.set("toJSON",{
    virtuals:true,
    versionKey:false,
    transform: function(doc,ret,options){
        delete (ret as { _id?: unknown })._id;
        delete (ret as  {password?:unknown}).password;
    }
});


export const UserModel = mongoose.model("User",useSchema);