const mongoose=require('mongoose');
const connectDB=async(DATABASE_URL)=>{
    try{
        await mongoose.connect(DATABASE_URL);
        console.log("connection successfully");
    }
    catch(err){
        console.log("error is:"+err);
    }
}
module.exports=connectDB;