import mongoose from "mongoose";
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    email : {type: String, required: [true, 'Email is required'], unique: true},
    password : {type: String, required: [true, 'Password is required']},
    firstName : {type: String, required: true},
    lastName : {type: String, required: false},
    image : {type: String , required: false},
    color : {type: Number, required: false},
    profileSetup : {type: Boolean, required: false , default: false},
});

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});


const userModel = mongoose.model('User', userSchema);
export default userModel;