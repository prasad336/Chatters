import conversationModel from "../model/conversation.js";
import userModel from "../model/user.js"

export const userBySearch = async (req, res) => {
    try {
        const userId = req.user._id;
        const { user } = req.body;

        const userSearch = String(user);
        const getUser = await userModel.findOne({
            $and: [
                {
                    $or: [
                        { name: { $regex: userSearch, $options: 'i' } },
                        { username: { $regex: userSearch, $options: 'i' } }
                    ]
                },
                {
                    _id: { $ne: userId }
                }
            ]
        });

        if (getUser) {
            res.send({ user: getUser });
        } else {
            res.status(404).send({ msg: "No user found" });
        }
    } catch (error) {
        console.error("userBySearch Error:", error);
        res.status(500).send({ msg: "Internal server error" });
    }
};

export const myUsers = async (req, res) => {

    const userId = req.user._id.toString();

    const myusers = await conversationModel.find({
        participants: userId
    })
   
    const otherUserIds = myusers.map((conversation) => {
        const id1 = conversation.participants[0]._id.toString();
        const id2 = conversation.participants[1]._id.toString();
        
        const otherIds = id1 === userId ? id2 : id1
        return otherIds;        
    });
    
    const users = await Promise.all(
        otherUserIds.map(async (user) => {
            return await userModel.findById(user)


        })
    )
    res.send(users)


}