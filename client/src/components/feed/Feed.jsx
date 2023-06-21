import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
const Feed = ({ username }) => {
  const [Posts, setPosts] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = username
          ? await axios.get(`/posts/profile/${username}`)
          : await axios.get(`/posts/timeline/${currentUser.user._id}`);
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, [username, currentUser.user._id]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === currentUser.user.username) && <Share />}
        {Posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
