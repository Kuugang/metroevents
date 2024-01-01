import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../utils/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-regular-svg-icons";
import { logout, getUser, getCookie } from "../utils/helper";
import { useContext, useEffect, useState } from "react";
import Register from "./Register";
import Login from "./Login";
import { axiosFetch } from "../utils/axios";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [notificationsIsOpen, setNoticationsIsOpen] = useState(false);

  const {
    userData,
    setUserData,
    isLoggedIn,
    setIsLoggedIn,
  } = useContext(MyContext);

  const navigate = useNavigate();

  function openRegisterModal() {
    setRegisterModalIsOpen(true);
    closeLoginModal();
  }

  function closeRegisterModal() {
    setRegisterModalIsOpen(false);
  }

  function openLoginModal() {
    setLoginModalIsOpen(true);
    closeRegisterModal();
  }

  function closeLoginModal() {
    setLoginModalIsOpen(false);
  }

  function toggleNotificationsIsOpen() {
    setNoticationsIsOpen(!notificationsIsOpen);
  }

  async function handleLogout() {
    logout()
      .then(() => {
        setIsLoggedIn(false);
        setUserData("")
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function handleReadNotification(notification) {
    let data = await axiosFetch.post(
      `/user/notifications?notification_id=${notification.id}`
    );

    if (data.status !== 200) {
      return new Error(data.message);
    }

    let userNotifications = userData.notifications.slice(); 

    userNotifications = userNotifications.map((n) => {
      if (n.id === notification.id) {
        return { ...n, read: true }; 
      }
      return n;
    });

    userData.notifications = userNotifications;
    setUserData({ ...userData });

    switch (notification.type) {
      case 1:
      case 3:
        navigate(`/event/${notification.event_id}`);
        break;
      case 2:
        navigate(`/${userData.username}`);
        break;
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsIsOpen) {
        const notificationsButton = document.getElementById(
          "notificationsButton"
        );
        const notificationsContainer = document.getElementById("notifications");
        if (
          notificationsButton &&
          !notificationsButton.contains(event.target) &&
          notificationsContainer &&
          !notificationsContainer.contains(event.target)
        ) {
          setNoticationsIsOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsIsOpen]);

  useEffect(() => {
    if (isLoggedIn == true) {
      getUser(userData.username).then((data) => {
        setUserData(data);
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    try{
      if(jwtDecode(getCookie("auth"))){
        setUserData(JSON.parse(localStorage.getItem("userDetails")))
        setIsLoggedIn(true)
      }
    }catch(error){
      navigate("/")
    }
  }, [])

  return (
    <>
      <nav className="fixed shadow-2xl text-md top-0 flex flex-row justify-between w-full p-3 items-center bg-[rgb(41,41,41)] border-b-[rgb(128,128,128)] z-50">
        <Link
          to={isLoggedIn ? "dashboard" : "/"}
          className="flex flex-row items-center gap-1"
        >
          <h1>Metro</h1>
          <div className="bg-[rgb(255,163,26)] rounded p-[1px] text-black">
            <h1>Events</h1>
          </div>
        </Link>

        <div className="flex flex-row gap-2 text-base items-center">
          {(userData.privilege === "organizer" ||
            userData.privilege == "admin") && (
            <>
              <Link to="/createEvent">
                <button>Create Event</button>
              </Link>
              {userData.privilege === "admin" && (
                <Link to="/dashboard/admin">
                  <button>Admin Dashboard</button>
                </Link>
              )}
            </>
          )}
        </div>

        {isLoggedIn ? (
          <div id="navUserLinks" className="flex flex-row gap-2">
            <div className="">
              <Link to={`/${userData.username}`}>
                <button>
                  <FontAwesomeIcon icon={faUser} />
                </button>
              </Link>
              <>
                <button
                  className="relative"
                  id="notificationsButton"
                  onClick={toggleNotificationsIsOpen}
                >
                  <FontAwesomeIcon icon={faBell} />
                  {userData.notifications && (
                    <p className="font-semibold absolute -top-[3px] right-[2px]">
                    {userData.notifications.filter((notification) => !notification.read).length}
                    </p>
                  )}
                </button>
                {(userData &&
                  userData.notifications.length &&
                  notificationsIsOpen == true) > 0 && (
                  <div
                    id="notifications"
                    className="text-white shadow-2xl max-w-[300px] text-sm absolute bg-[rgb(41,41,41)] border border-gray-300 right-2 p-1 mt-2 rounded-md shadow-md"
                  >
                    <>
                      {userData.notifications.map((n) => {
                        return (
                          <button
                            onClick={() => handleReadNotification(n)}
                            key={n.id}
                            className={`border-b-black ${
                              n.read ? "bg-gray-100" : ""
                            }`}
                          >
                            <p>{n.notification}</p>
                            <p>{Boolean(n.read)}</p>
                          </button>
                        );
                      })}
                    </>
                  </div>
                )}
                <button onClick={handleLogout}>Logout</button>
              </>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={openLoginModal}>Login</button>
            <button onClick={openRegisterModal}>Register</button>
            <Login
              isOpen={loginModalIsOpen}
              setLoginModalIsOpen = {setLoginModalIsOpen}
              onClose={closeLoginModal}
              openRegisterModal={openRegisterModal}
            ></Login>
            <Register
              isOpen={registerModalIsOpen}
              setRegisterModalIsOpen={setRegisterModalIsOpen}
              onClose={closeRegisterModal}
            ></Register>
          </div>
        )}
      </nav>
    </>
  );
}
