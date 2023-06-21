import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import { IconButton } from "@mui/material";
import axios from "axios";
import { format } from "timeago.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(
    post.likes.includes(currentUser.user._id)
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [user, setUser] = useState({});
  const postUserId = post.userId;
  const currentUserId = currentUser.user._id;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${postUserId}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [postUserId]);

  const likeHandler = () => {
    try {
      axios.put(`/posts/${post._id}/like`, { userId: currentUserId });
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link
              to={`/profile/${user.username}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                className="postProfileImg"
                src={user.profilePic || "https://i.imgur.com/Qr71crq.png"}
                alt=""
              />
            </Link>
            <Link
              to={`/profile/${user.username}`}
              className="postUsername"
              style={{ textDecoration: "none" }}
            >
              <span>{user.username}</span>
            </Link>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <IconButton className="postTopRight">
            <MoreVertIcon />
          </IconButton>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={`${PF}/${post.img}`} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <IconButton onClick={likeHandler} aria-label="Like" color="primary">
              <ChatIcon className="likeIcon" />
            </IconButton>
            <IconButton onClick={likeHandler} aria-label="Like" color="primary">
              <FavoriteIcon className="likeIcon" />
            </IconButton>
            <span className="postLikeCounter">{likesCount} likes</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post?.comments} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
