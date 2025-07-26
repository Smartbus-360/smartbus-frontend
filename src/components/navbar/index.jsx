import React, {useState, useEffect} from "react";
import Dropdown from "../dropdown/index";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
} from "react-icons/io";
import avatar from "../../assets/img/avatars/user.png";
import { removeTokenAndUser } from '../../config/authService.js';
import { useNavigate } from "react-router-dom";
import { getUser } from "../../config/authService.js";
import { socket } from "../../config/socket.js";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setInstituteDetails } from '../../reducers/actions.js';
import axiosInstance from "../../api/axios.js";

const Navbar = (props) => {
  const dispatch = useDispatch();
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const user = getUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readNotifications, setReadNotifications] = useState([]);

  function showNotification(message) {
    // Convert message to a readable string if it's not one already
    const messageText = typeof message === "string" ? message : JSON.stringify(message);
    
    // Store notification
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { text: messageText, read: false }
    ]);
  
    // Store the actual message in read notifications state
    setReadNotifications((prevReadNotifications) => [
      ...prevReadNotifications,
      { text: messageText, read: false }
    ]);
  
    setUnreadCount((prevCount) => prevCount + 1);
  }
  
  useEffect(() => {
    // Initialize state from localStorage
    const storedReadNotifications = JSON.parse(localStorage.getItem("readNotifications")) || [];
    setReadNotifications(storedReadNotifications);

    // Initialize notifications state (add logic to load existing notifications if any)
    const existingNotifications = []; // Replace with your logic to load notifications
    setNotifications(existingNotifications.map((notification, index) => ({
      ...notification,
      read: storedReadNotifications.includes(index),
    })));
    
    setUnreadCount(existingNotifications.filter((n) => !n.read).length);
  }, []);
  
  // useEffect(() => {
  //   const storedReadNotifications = JSON.parse(localStorage.getItem("readNotifications")) || [];
  //   setReadNotifications(storedReadNotifications);
  // }, []);
  const handleNotificationClick = (index) => {
    const notification = notifications[index];

    // Mark the notification as read in state
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification, i) =>
        i === index ? { ...notification, read: true } : notification
      )
    );

    // Update readNotifications and localStorage
    if (!readNotifications.includes(notification.text)) {
      const updatedReadNotifications = [...readNotifications, notification.text];
      setReadNotifications(updatedReadNotifications);
      localStorage.setItem("readNotifications", JSON.stringify(updatedReadNotifications));
    }

    setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
  };
  
  // Mark all notifications as read and store in localStorage
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }));
    
    setNotifications(updatedNotifications);
    setReadNotifications(updatedNotifications.map(n => n.text)); // Save read notification texts
    localStorage.setItem("readNotifications", JSON.stringify(updatedNotifications.map(n => n.text)));
    setUnreadCount(0); // Reset unread count
  };
  
  useEffect(() => {
    // Listen for new institute notifications
    socket.on("newInstitute", (data) => {
      showNotification(data.message);
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off("newInstitute");
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    users: [],
    drivers: [],
    buses: [],
    institutes: []
  });
  const token = sessionStorage.getItem('authToken');
  const [showResults, setShowResults] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const handleSearch = async () => {
    if (!searchQuery) {
      setShowResults(false); // Hide results when the search query is empty
      return; 
    } 

    try {
      const response = await axiosInstance.get(`search`, {
        params: { query: searchQuery },
      });
      if (response.status === 200) {
        const { users, drivers, buses, institutes } = response.data;

        const instituteArray = institutes.institutes || [];
      
        if (users.length > 0 || drivers.length > 0 || buses.length > 0 || instituteArray.length > 0) {
          setSearchResults(response.data);
          setShowResults(true); 
          setResultMessage(''); 
        } else {
          setResultMessage('No results found'); 
          setShowResults(true); 
        }
      }
      
    } catch (error) {
      console.error("Search error:", error);
      setShowResults(false); // Hide results on error
    }
  };
  
  const handleInstituteClick = (institute) => {
    dispatch(setInstituteDetails(institute));
  };

  const profilePicture = user?.profile_picture || avatar; 
  const username = user?.username || "";
  const email = user?.email || "No email provided";

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
      <div className="relative flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
        <button className="pl-3 pr-2 text-xl" onClick={handleSearch}>
          <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter
          className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:text-white sm:w-fit"
        />
        {showResults && (
          <div className="absolute z-50 top-10 min-h-[max-content] min-w-[300px] rounded-md bg-white shadow-lg dark:bg-navy-700">
            <div className="relative overflow-hidden">
              <button className="absolute top-2 right-2 text-gray-600 dark:text-white" onClick={() => setShowResults(false)}>
                <span className="text-xs">✖️</span>
              </button>
              {resultMessage ? (
                <p className="p-4 text-center text-gray-600 dark:text-white">{resultMessage}</p>
              ) : (
                  <div className="flex flex-col min-h-auto overflow-y-auto">
                  {Array.isArray(searchResults.institutes?.institutes) && searchResults.institutes.institutes.length > 0 ? (
                    searchResults.institutes.institutes.map((institute, index) => (
                      <div key={index} className="flex items-center p-3 dark:hover:bg-gray-600 transition-colors duration-200">
                        <div className="flex-1">
                          <Link 
                            to={`/search/${institute.id}`}
                            onClick={() => handleInstituteClick(institute)}
                            className="font-semibold text-gray-800 dark:text-white"
                          >
                            {institute.name}
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-center text-gray-600 dark:text-white">No institutes found.</p>
                  )}

                  {searchResults.drivers.map((institute, index) => (
                    <div key={index} className="flex items-center p-3 dark:hover:bg-gray-600 transition-colors duration-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white">{institute.name}</p>
                      </div>
                    </div>
                  ))}
                  {searchResults.buses.map((institute, index) => (
                    <div key={index} className="flex items-center p-3 dark:hover:bg-gray-600 transition-colors duration-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white">{institute.name}</p>
                      </div>
                    </div>
                  ))}
                  {searchResults.users.map((institute, index) => (
                    <div key={index} className="flex items-center p-3 dark:hover:bg-gray-600 transition-colors duration-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white">{institute.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        {/* start Notification */}
            <Dropdown
                button={
                    <p className="cursor-pointer relative">
                      <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                          {unreadCount}
                        </span>
                      )}
                    </p>
                }
                // Adjust animation and classNames as needed
                children={
                    <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
                        <div className="flex items-center justify-between">
                            <p className="text-base font-bold text-navy-700 dark:text-white">Notification</p>
                            <button className="text-sm font-bold text-navy-700 dark:text-white" onClick={markAllAsRead}>
                              Mark all read
                            </button>
                        </div>
                        {notifications.map((notification, index) => (
                          <button
                              key={index}
                              className={`flex w-full items-center ${notification.read ? "opacity-50 cursor-not-allowed" : ""}`}
                              onClick={() => !notification.read && handleNotificationClick(index)} // Only clickable if unread
                              disabled={notification.read} // Disable button if read
                          >
                              <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                                      {notification.text}
                                  </p>
                              </div>
                          </button>
                        ))}
                        {readNotifications.map((notification, index) => (
                          <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                              <p className="mb-1 text-left text-base font-light text-gray-400 dark:text-white">
                                  {notification.text}
                              </p>
                          </div>
                        ))}
                    </div>
                }
                classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
            />
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full cursor-pointer"
src={`${import.meta.env.VITE_API_BASE_URL}/${profilePicture}`}
              alt={username}
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, {username}
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <Link to="/admin/profile"
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white mb-3" 
                >
                  Profile Settings
                </Link>
                {/* <div className="h-px w-full bg-gray-200 dark:bg-white/20 " /> */}
                <button
                  onClick={() => {
                    removeTokenAndUser();
                    navigate('/auth/sign-in');
                  }}
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
