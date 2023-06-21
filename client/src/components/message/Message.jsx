import "./message.css";
import {format} from 'timeago.js'
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useEffect, useState } from "react";
import axios from "axios";
 
const Message = ({ own=false, message }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${message.sender}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [message.sender]);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
        <p className="messageTime">{format(message.createdAt)}</p>
        {/* <p className="messageInfo"><DoneAllIcon /></p> */}
      </div>
    </div>
  );
};

export default Message;
