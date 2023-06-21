import "./chatOnline.css";
import { useEffect, useState } from "react";
import axios from "axios";
const ChatOnline = ({ onlineUsers, currentUser, setCurrentChat }) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get(`/users/friends/${currentUser.user._id}`);
        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [currentUser.user._id]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(`/conversations/find/${currentUser.user._id}/${user._id}`);
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  

  return (
    <div className="chatOnline">
      {onlineFriends.map((friend) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(friend)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={friend.profilePicture ? friend.profilePicture : "https://picsum.photos/200"}
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{friend.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;
