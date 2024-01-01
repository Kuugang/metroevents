import React, { useContext } from "react";
import { useFetchAllEvents, useFetchEventTypes } from "./utils/helper";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MyContext } from "./utils/Context";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import ManageEvent from "./pages/ManageEvent";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound"

function App() {
  const { setEvents } = useContext(MyContext);
  useFetchAllEvents(1);
  useFetchEventTypes();


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
                  <CreateEvent>
                  </CreateEvent>
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
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
