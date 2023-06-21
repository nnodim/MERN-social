import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
export default function Topbar() {
  const { user: currentUser } = useContext(AuthContext);
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">MERN</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <SearchIcon className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <Link to={`/messenger`} style={{ textDecoration: "none", color: "white" }} className="topbarIconItem">
            <ChatIcon />
            
            <span className="topbarIconBadge">2</span>
          </Link>
          <div className="topbarIconItem">
            <NotificationsIcon />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="dropdown">
            <img
              data-bs-toggle="dropdown"
              aria-expanded="false"
              src={
                currentUser.user.profilePic || "https://i.imgur.com/Qr71crq.png"
              }
              alt=""
              className="topbarImg"
            />
            <ul className="dropdown-menu">
              <li>
                <a
                  className="dropdown-item"
                  href={`/profile/${currentUser.user.username}`}
                >
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  My account
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
