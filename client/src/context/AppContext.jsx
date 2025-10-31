import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: ''
  })

  const [isSearched, setIsSearched] = useState(false)

  const [user, setUser] = useState(null);

  const value = {
    user, setUser,
    searchFilter, setSearchFilter,
    isSearched, setIsSearched,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
