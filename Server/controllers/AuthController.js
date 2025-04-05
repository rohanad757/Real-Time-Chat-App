import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const maxAge = 3 * 24 * 60 * 60;
const createToken = ( id ) => {
    return jwt.sign({ id } , process.env.JWT_KEY , {expiresIn : maxAge});
};

export const signUp = async (req , res) => {
    try {
    const { email , password , firstName } = req.body;
    if(!email || !password || !firstName){
        return res.status(400).json("Please Enter all Fields");
    };
    const createUser = await User.create({ email , password , firstName , image : req.file ? req.file.buffer.toString('base64') : "" });
    if(!createUser){
        return res.status(400).json("User Already Exists");
    }
    res.cookie('jwt', createToken(createUser._id), {
        httpOnly: true,
        maxAge: maxAge * 1000,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    // console.log("Create User : " , createUser);
    res.status(201).json({
        id : createUser._id ,
        email : createUser.email,
        firstName : createUser.firstName,
        profileSetup : createUser.profileSetup,
    });
    } catch (error) {
        res.status(500).json("Internal Server Error");
    }
};

export const login = async (req , res) => {
    try {
    const { email , password } = req.body;
    if(!email || !password){
        return res.status(400).json("Please Enter all Fields");
    };
    const cheakUser = await User.findOne({ email });
    // console.log("Cheak User : " , cheakUser);
    if(!cheakUser){
        return res.status(400).json("User Not Found");
    };
    const cheakPassword = await bcrypt.compare(password , cheakUser.password);
    if(!cheakPassword){
        return res.status(400).json("Invalid Credentials");
    };
    const token = createToken(cheakUser._id);
    // console.log("Token : " , token);
    const decode = jwt.verify(token , process.env.JWT_KEY);
    // console.log("Decode : " , decode);
    res.cookie('jwt' , token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        secure: true,
        sameSite: 'none',
    });
    res.status(200).json({
        id : cheakUser._id ,
        email : cheakUser.email,
        firstName : cheakUser.firstName,
        profileSetup : cheakUser.profileSetup,
        token : token,
    });
    } catch (error) {
        res.status(500).json("Internal Server Error");
    }
};

export const getCurrentUser = async (req , res) => {
    try {
        const userId = req.userId;
        // console.log("User ID : " , userId);
        const findUser = await User.findById(userId);
        if(!findUser){
            return res.status(400).json("User Not Found");
        };
        // console.log("Server side : " , findUser);
        res.status(200).json({
            id : findUser._id ,
            email : findUser.email,
            firstName : findUser.firstName,
            lastName : findUser.lastName,
            image : findUser.image,
            profileSetup : findUser.profileSetup,
        });
    } catch (error) {
        return res.status(500).json("Internal Server Error"); 
    }
};

export const updateProfile = async (req , res) => {
    try {
        const userId = req.userId;  
        console.log("User ID : " , req.userId);
        const file = req.file;
        const { firstName , lastName } = req.body;
        const findUser = await User.findById(userId);
        if(!findUser){
            return res.status(400).json("User Not Found");
        };
        const updateUser = await User.findByIdAndUpdate(userId , {
            firstName : firstName || findUser.firstName,
            lastName : lastName || findUser.lastName,
            image : file ? file.buffer.toString('base64') : findUser.image,
            profileSetup : true,
        } , {new : true});
        if(!updateUser){
            return res.status(400).json("User Not Found");
        }
        res.status(200).json({
            id : updateUser._id ,
            email : updateUser.email,
            firstName : updateUser.firstName,
            lastName : updateUser.lastName,
            profileSetup : updateUser.profileSetup,
            image : updateUser.image,
        });
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
};

export const getImage = async (req , res) => {
    try {
        const userId = req.userId;  
        const findUser = await User.findById(userId);
        if(!findUser){
            return res.status(400).json("User Not Found");
        };
        res.status(200).json(findUser.image);
    } catch (error) {
        return res.status(500).json("Internal Server Error");   
    }
};

export const removeImage = async (req , res) => {
    try {
        const userId = req.userId;
        console.log("User ID : " , userId);
        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(400).json("User Not Found");
        }
        console.log("User : " , findUser);
        const removeImage = await User.findByIdAndUpdate(userId, {
            image: "",
        }, { new: true });   
        res.status(200).json({
            id: removeImage._id,
            email: removeImage.email,
            firstName: removeImage.firstName,
            lastName: removeImage.lastName,
            profileSetup: removeImage.profileSetup,
            image: removeImage.image,
        });
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
};  

export const logout = async (req , res) => {
    try {
        res.cookie('jwt' , '' , {
            maxAge : 1,
            httpOnly : true,
            secure : true,
            sameSite : 'none',
        });
        return res.status(200).json("Logout Successfully");
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
};
