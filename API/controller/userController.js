const User = require('../model/user');

const getUser = async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (req.body.userId === id || req.body.isAdmin) {
        if (password) {
            try {
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json("Account has been updated");
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You can update only your account");
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (req.body.isAdmin || req.body.userId === id) {
        try {
            await User.findByIdAndDelete(id);
            res.status(200).json("Account has been deleted");
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You can delete only your account");
    }
}

const followUser = async (req, res) => {
    const { id } = req.params;
    if (req.body.userId !== id) {
        try {
            const user = await User.findById(id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { following: id } });
                res.status(200).json("User has been followed");
            } else {
                res.status(403).json("You are already following this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You can't follow yourself");
    }
}
const getFriends = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.following.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendsData = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendsData.push({ _id, username, profilePicture });
        })
        res.status(200).json(friendsData);
    } catch (error) {
        res.status(500).json(error);
    }
}

const unfollowUser = async (req, res) => {
    const { id } = req.params;
    if (req.body.userId !== id) {
        try {
            const user = await User.findById(id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { following: id } });
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You are not following this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You can't unfollow yourself");
    }
}


module.exports = {
    updateUser,
    deleteUser,
    getUser,
    followUser,
    unfollowUser,
    getFriends
}