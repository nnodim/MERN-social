import "./conversations.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Conversations = ({ conversation, currentUser }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const friendId = conversation.members.find(
      (member) => member !== currentUser.user._id
    );
    const getUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${friendId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser.user._id, conversation.members]);
  return (
    <div className="conversations">
      <div className="conversationsWrapper">
        <img
          className="conversationsImg"
          src={
            user?.profilePicture
              ? user?.profilePicture
              : "https://picsum.photos/200"
          }
          alt=""
        />
        <span className="conversationsName">{user?.username}</span>
      </div>
    </div>
  );
};

export default Conversations;
