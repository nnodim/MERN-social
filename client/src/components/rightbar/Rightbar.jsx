import "./rightbar.css";
// import { Users } from "../../dummyData";
// import Online from "../online/Online";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@mui/material";
import { io } from "socket.io-client";
import ChatOnline from "../chatOnline/ChatOnline";

export default function Rightbar({ user }) {
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.emit("addUser", currentUser.user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.user.following.filter((f) =>
          users.some((u) => u.userId === f)
        )
      );
    });
  }, [currentUser]);

  useEffect(() => {
    if (user) {
      setFollowed(currentUser.user.following.includes(user._id));
    }
  }, [currentUser, user]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(`/users/friends/${user._id}`);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) {
      getFriends();
    }
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser.user._id,
        });
        dispatch({
          type: "UNFOLLOW",
          payload: user._id,
        });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser.user._id,
        });
        dispatch({
          type: "FOLLOW",
          payload: user._id,
        });
      }
    } catch (err) {
      console.log(err);
    }
    setFollowed(!followed);
  };

  const HomeRightbar = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
      <>
        <div className="birthdayContainer">
          <CardGiftcardIcon className="birthdayImg" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src={PF + "ad.jpg"} alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          <ChatOnline
            // setCurrentChat={setCurrentChat}
            currentUser={currentUser}
            onlineUsers={onlineUsers}
          />
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.user.username && (
          <Button onClick={handleClick} size="small" variant="contained">
            {followed ? "Unfollow" : "Follow"}
          </Button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city || "N/A"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from || "N/A"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "single"
                : user.relationship === 2
                ? "Married"
                : "N/A"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <div className="rightbarFollowing">
              <Link
                to={`/profile/${friend.username}`}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="rightbarFollowingImg"
                  src={
                    friend.profilePicture
                      ? friend.profilePicture
                      : "https://i.imgur.com/Qr71crq.png"
                  }
                  alt=""
                />
              </Link>
              <Link
                to={`/profile/${friend.username}`}
                className="rightbarFollowingName"
                style={{ textDecoration: "none" }}
              >
                <span>{friend.username}</span>
              </Link>
            </div>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
