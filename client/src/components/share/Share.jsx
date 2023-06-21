import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function Share() {
  const { user: currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const desc = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: currentUser?.user?._id,
      desc: desc?.current?.value,
    };
    if (file) {
      const data = new FormData();
      const filename = `${Date.now()}_${file?.name}`;
      data.append("name", filename);
      data.append("file", file);
      newPost.img = filename;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              currentUser?.user?.profilePic || "https://i.imgur.com/Qr71crq.png"
            }
            alt=""
          />
          <input
            placeholder={`What's in your mind ${currentUser?.user?.username}...`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <IconButton
              variant="contained"
              onClick={() => setFile(null)}
            >
              <CloseIcon />
            </IconButton>
          </div>
        )}
        <form className="shareBottom" onSubmit={handleSubmit}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMediaIcon htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo/Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <LabelIcon htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <RoomIcon htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <Button
            type="submit"
            size="small"
            variant="contained"
            endIcon={<SendIcon />}
          >
            Share
          </Button>
        </form>
      </div>
    </div>
  );
}
