const Conversation = require('../model/conversations')

const createConversation = async (req, res) => {
    const conversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })
    console.log(conversation);
    try {
        const savedConversation = await conversation.save()
        res.status(200).json(savedConversation)
    } catch (err) {
        res.status(500).json(err)
    }
}

const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find(
            {
                members: {
                    $in: [req.params.userId]
                }
            }
        )
        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteConversation = async (req, res) => {
    try {
        const deletedConversation = await Conversation.deleteOne({
            members: {
                $in: [req.params.userId]
            }
        })
        res.status(200).json(deletedConversation)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getConversationById = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: {
                $all: [req.params.firstId, req.params.secondId]
            }
        })
        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports ={
    createConversation,
    getConversation,
    getConversationById,
    deleteConversation
}