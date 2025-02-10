const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");

const userRoutes=require("./routes/user.route");
const authRoutes=require("./routes/auth.route");
dotenv.config();
mongoose.connect("mongodb://localhost:27017").then(()=>{
    console.log("Connected to mongodb");
})
.catch((err)=>{
    console.log(err);
});
const app=express();
app.use(express.json());
app.listen(3000,()=>{
    console.log("Server is listening port 3000");
});

app.get("/",(req,res)=>{
    res.json({
        message:'API is working',
    });
})

app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Internal server error';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
})