const mongoose=require('mongoose');
// const URI="mongodb+srv://hulk:hulk@cluster0.fr8yj.mongodb.net/test";
const URI="mongodb://localhost:27017/test1";




const connectDB=async()=>{
    await mongoose.connect(process.env.MONGODB_URI  || URI,{ useNewUrlParser: true,useUnifiedTopology: true  });
    console.log("DB CONNECTED");

}
module.exports=connectDB;