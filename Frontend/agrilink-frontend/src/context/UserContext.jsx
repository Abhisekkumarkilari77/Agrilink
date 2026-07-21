import React, { createContext, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
  return (
    <UserContext.Provider value={{}}>
      {children}
    </UserContext.Provider>
  );
};
