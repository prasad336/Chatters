import conversationModel from "../model/conversation.js"
import messageModel from "../model/message.js"
import { getRecieverSocketId, io } from "../socket/socket.js"

export const sendMessage = async (req, res) => {

    try {
        const senderId = req.user._id
        const recieverId = req.params.id
        const { message } = req.body
    
        const participant = await conversationModel.findOne({participants:{$all:[senderId,recieverId]}})

        let newParticipant;
     
        if(!participant){
            newParticipant = await conversationModel.create({participants:[senderId,recieverId]})
            
        }

        const newMessage = await messageModel.create({ senderId, recieverId, message,conversationId:participant ? participant._id : newParticipant._id })
       
        if(newMessage){
            const conversationId = participant ? participant._id : newParticipant._id;
            await conversationModel.findByIdAndUpdate(
                conversationId,
                { $push: { messages: newMessage._id } },
                { new: true, useFindAndModify: false } 
            );
        }

        const recieverSocketId = getRecieverSocketId(recieverId)
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",newMessage)
        }

        res.send({msg:newMessage})

    } catch (error) {
        console.log("sendMessage Error", error)
    }


}
export const getMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const recieverId = req.params.id;

        const chats = await conversationModel.findOne({
            participants: { $all: [senderId, recieverId] }
        }).populate("messages");

        if (!chats) {
            return res.json({msg:""}) ;
           
        }

        res.send({ msg: chats.messages });
       
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};
