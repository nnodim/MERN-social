const Post = require('../model/post')
const User = require('../model/user')

const createPost = async (req, res) => {
    const post = new Post(req.body)
    try {
        const savedPost = await post.save()
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err)
    }
}

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json('Post has been updated')
        } else {
            res.status(403).json('You can update only your post')
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json('Post has been deleted')
        } else {
            res.status(403).json('You can delete only your post')
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json('Post has been liked')
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json('Post has been disliked')
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getTimeline = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json(error)
    } 
}
const getUserPosts = async (req, res) => {
    try {
        // Find user by username
        const user = await User.findOne({ username: req.params.username });

        // Find all posts by user
        const posts = await Post.find({ userId: user._id });

        // Return posts
        res.status(200).json(posts);
    } catch (error) {
        // Handle errors
        res.status(500).json(error);
    }
}

module.exports = {
    createPost,
    getTimeline,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getUserPosts
}