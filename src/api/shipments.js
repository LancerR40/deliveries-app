import axios from "axios"
import * as SecureStore from "expo-secure-store";
import { GET_ASSIGNED_SHIPMENT_URL, SHIPMENT_TRACKING_URL, CONFIRM_SHIPMENT_URL, CANCEL_SHIPMENT_URL } from "./constants"

export const getAssignedShipmentAPI = async () => {
  let token = await SecureStore.getItemAsync("token") || ""

  try {
    const request = await axios.get(GET_ASSIGNED_SHIPMENT_URL, {
      headers: {
        "x-authorization-token": token
      }
    })

    return request.data
  } catch (error) {
    return error
  }
}

export const shipmentTrackingAPI = async (data) => {
  let token = await SecureStore.getItemAsync("token") || ""

  try {
    const request = await axios.post(SHIPMENT_TRACKING_URL, data, { headers: {  "x-authorization-token": token } })
    return request.data
  } catch (error) {
    return error
  }
}

export const confirmShipmentAPI = async (data) => {
  let token = await SecureStore.getItemAsync("token") || ""

  try {
    const request = await axios.patch(CONFIRM_SHIPMENT_URL, data, { headers: { "x-authorization-token": token } })
    return request.data
  } catch (error) {
    return error
  }
}

export const cancelShipmentAPI = async (data) => {
  let token = await SecureStore.getItemAsync("token") || ""

  try {
    const request = await axios.patch(CANCEL_SHIPMENT_URL, data, { headers: { "x-authorization-token": token } })
    return request.data
  } catch (error) {
    return error
  }
}