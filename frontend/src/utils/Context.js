import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [userData, setUserData] = useState('');
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <MyContext.Provider value={{ isLoggedIn, setIsLoggedIn, userData, setUserData, events, setEvents, eventTypes, setEventTypes}}>
      {children}
    </MyContext.Provider>
  );
};