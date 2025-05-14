import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [buildingList, setBuildingList] = React.useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [navigationList, setNavigationList] = useState([]);
  const fetchNavigationsData = async () => {
    // Fetch data from API
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_URL + "/navigations"
      );
      const data = response.data.data;

      setNavigationList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchBuildings = async () => {
    const res = await axios(import.meta.env.VITE_SERVER_URL + "/buildings/");
    const data = res.data;
    setBuildingList(data.data);
  };

  useEffect(() => {
    try {
      handleFetchBuildings();
      fetchNavigationsData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <AppContext.Provider value={{ buildingList, navigationList, selectedRoom, setSelectedRoom }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
