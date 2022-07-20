import { createContext, useContext, useState, useEffect } from "react";
import { getAssignedShipmentAPI } from "../api/shipments"
import * as SecureStore from "expo-secure-store";

export const ShipmentContext = createContext(null)

export const ShipmentContextProvider = ({ children }) => {
    const [shipments, setShipments] = useState({ all: [], active: null })

    useEffect(() => {
      getShipments()
    }, [])

    const getShipments = async () => {
      const response = await getAssignedShipmentAPI()
      
      if (response?.response?.status >= 401) {
        await SecureStore.deleteItemAsync("token")
        return setIsAuth(false)
      }

      if (response.success) {
        setShipments(response.data)
      }
    }
    
    const value = { shipments, setShipments, getShipments }

    return <ShipmentContext.Provider value={value}>{children}</ShipmentContext.Provider>
}

export const useShipmentContext = () => useContext(ShipmentContext)