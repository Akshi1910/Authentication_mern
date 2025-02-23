const User=require("../models/user.model");
const bcryptjs=require("bcryptjs");
const errorHandler=require("../utils/error")
const jwt=require("jsonwebtoken");
const signup = async(req, res,next) => {
    const{username,email,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password:hashedPassword});
    try{
    await newUser.save();
    res.status(201).json({message:"User created successfully"});
    }catch(error){
        next(error);
    }
}

const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const validUser=await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'User Not Found'));
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(401,'Wrong Credentials');
        const token=jwt.sign({id:validUser._id},'kcndbuvbjdbjdsv254djvndljdvbkxzc1524xcznxjcnjsd');
        const {password:hashedPassword, ...rest}=validUser._doc;
        const expiryDate=new Date(Date.now()+3600000);
        res.cookie('access_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
    }catch(error){
        next(error);
    }
}







module.exports = { signup,signin };
