const Message = require('../model/message')

const createMessage = async (req, res) => {
    const message = new Message(req.body)
    try {
        const savedMessage = await message.save()
        res.status(200).json(savedMessage)
    } catch (err) {
        res.status(500).json(err)
    }
}

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    createMessage,
    getMessages
}