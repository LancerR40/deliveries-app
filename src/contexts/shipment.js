import { createContext, useContext, useState, useEffect } from "react";
import { getAssignedShipmentAPI } from "../api/shipments"

export const ShipmentContext = createContext(null)

export const ShipmentContextProvider = ({ children }) => {
    const [shipments, setShipments] = useState({ all: [], active: null, isShipmentDeliverable: null })

    useEffect(() => {
      getShipments()
    }, [])

    const getShipments = async () => {
      const response = await getAssignedShipmentAPI()

      if (response.success) {
        setShipments(response.data)
      }
    }
    
    const value = { shipments, setShipments, getShipments }

    return <ShipmentContext.Provider value={value}>{children}</ShipmentContext.Provider>
}

export const useShipmentContext = () => useContext(ShipmentContext)