import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversations from "../../components/conversations/Conversations";
import Message from "../../components/message/Message";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import SearchIcon from "@mui/icons-material/Search";
import TextareaAutosize from "@mui/base/TextareaAutosize";



const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user: currentUser } = useContext(AuthContext);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
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
    const getConversations = async () => {
      try {
        const res = await axios.get(`/conversations/${currentUser.user._id}`);
        const data = res.data;
        setConversations(data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser.user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/messages/${currentChat?._id}`);

        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: currentUser.user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentUser.user._id
    );

    socket.current.emit("sendMessage", {
      senderId: currentUser.user._id,
      receiverId: receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="chatMenuTop">
              <h1>Messages</h1>
              <IconButton>
                <AddIcon />
              </IconButton>
            </div>
            <div className="search-box">
              <div className="input-wrapper">
                <SearchIcon
                  style={{
                    color: "grey",
                    marginLeft: "7px",
                    verticalAlign: "middle",
                  }}
                />
                <input
                  placeholder="Search"
                  type="text"
                  className="chatMenuInput"
                />
              </div>
            </div>

            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversations
                  key={c._id}
                  conversation={c}
                  currentUser={currentUser}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        key={m._id}
                        message={m}
                        own={m.sender === currentUser.user._id}
                      />
                    </div>
                  ))}
                </div>
                <form className="chatBoxBottom">
                  <TextareaAutosize
                    maxRows={3}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="chatMessageInput"
                  />
                  <IconButton
                    variant="contained"
                    className="chatSubmitButton"
                    onClick={handleSubmit}
                  >
                    <SendIcon />
                  </IconButton>
                </form>
              </>
            ) : (
              <span className="chatNoConversation">
                Start a new conversation
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <div className="chatOnlineTop">
              <span className="chatOnlineTitle">Online</span>
              <span className="chatOnline-badge"></span>
            </div>
            <ChatOnline
              setCurrentChat={setCurrentChat}
              currentUser={currentUser}
              onlineUsers={onlineUsers}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
