import mongoose from "mongoose";
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;


const messageSchema = new Schema({
    senderId : { type: objectId, required: true , ref: 'User' },
    receiverId : { type: objectId, required: true , ref: 'User' },
    message : { type: String, required: true , maxlength: 5000 , trim: true , 
        validator : [
            function(v) {
                return v.length <= 5000;
            }, 'Message exceeds the maximum length of 5000 characters.'
        ]
     },
}
, {timestamps: true}
);

const Message = mongoose.model('Message', messageSchema);
export default Message;


// {
//     "_id": "507f1f77bcf86cd799439011",
//     "senderId": "507f191e810c19729de860ea",
//     "receiverId": "507f191e810c19729de860eb",
//     "message": "Hey, how are you?",
//     "createdAt": "2025-04-01T12:00:00.000Z",
//     "updatedAt": "2025-04-01T12:00:00.000Z"
// }