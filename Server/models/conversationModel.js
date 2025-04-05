import mongoose from "mongoose";
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;


const conversationSchema = new Schema({
    participants : [{ type: objectId, ref: 'User' }],
    messages : [{ type: objectId, ref: 'Message' , default: [] }],

} , {timestamps: true});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;



// {
//     "_id": "507f1f77bcf86cd799439012",
//     "participants": ["507f191e810c19729de860ea","507f191e810c19729de860eb"],
//     "messages": ["507f1f77bcf86cd799439011"],
//     "createdAt": "2025-04-01T12:00:00.000Z",
//     "updatedAt": "2025-04-01T12:00:00.000Z"
// }