const mongoose=require('mongoose');
const URI="mongodb+srv://hulk:hulk@cluster0.fr8yj.mongodb.net/test?retryWrites=true&w=majority";

const connectDB=async()=>{
    await mongoose.connect(process.env.MONGODB_URI  || URI,{ useNewUrlParser: true,useUnifiedTopology: true  });
    console.log("DB CONNECTED");

}
module.exports=connectDB;