import React, { useContext, useEffect, useState } from "react";
import { useFetchAllEvents, useFetchEventTypes } from "./utils/helper";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MyContext } from "./utils/Context";
import { socket } from "./socket";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import ManageEvent from "./pages/ManageEvent";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function App() {
  const { isLoggedIn, events, setEvents, userData, setUserData } =
    useContext(MyContext);
  useFetchAllEvents(1);
  useFetchEventTypes();

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log(socket.id)
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onUpdateUserPrivilege(value) {
        console.log(value)
      try {
        const id = JSON.parse(localStorage.getItem("userDetails")).id;
        if (!id) return;
        if (value.user_id == id) {
          toast("User privilege updated");
          return;
        }
      } catch (error) {}
    }

    function onSendNotification(value) {
        console.log(value)
      try {
        const id = JSON.parse(localStorage.getItem("userDetails")).id;
        if (!id) return;
        if (value.user_id == id) {
          toast(value.message);
          return;
        }
      } catch (error) {}
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("Update user privilege", onUpdateUserPrivilege);
    socket.on("Send notification", onSendNotification);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("Update user privilege", onUpdateUserPrivilege);
      socket.off("Send notification", onSendNotification);
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="mt-20">
          <Routes>
            <Route path="/" element={<Dashboard></Dashboard>} />
            <Route path="/dashboard" element={<Dashboard></Dashboard>} />
            <Route
              exact
              path="/createEvent"
              element={
                <ProtectedRoute>
                  <CreateEvent></CreateEvent>
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/event/:id"
              element={<EventDetails></EventDetails>}
            />

            <Route
              exact
              path="/manageEvent/:id"
              element={
                <ProtectedRoute>
                  <ManageEvent></ManageEvent>
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/dashboard/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard></AdminDashboard>
                </ProtectedRoute>
              }
            />

            <Route exact path="/:username" element={<Profile></Profile>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
